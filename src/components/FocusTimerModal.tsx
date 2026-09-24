import { useState, useEffect, useRef } from 'react';
import { Task } from '../types/todo';
import { playTimerFinishSound } from '../utils/sound';
import { Play, Pause, RotateCcw, X, CheckCircle2, Flame, Bell } from 'lucide-react';

interface FocusTimerModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onCompletePomodoro: (taskId: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function FocusTimerModal({
  task,
  isOpen,
  onClose,
  onCompletePomodoro,
  onToggleTaskComplete,
}: FocusTimerModalProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const initialDuration = MODE_DURATIONS[mode];
  const timerRef = useRef<number | null>(null);

  // Reset timer when mode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(MODE_DURATIONS[mode]);
      setIsRunning(false);
    }
  }, [mode, isOpen]);

  // Timer interval tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playTimerFinishSound();

            if (mode === 'work' && task) {
              onCompletePomodoro(task.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, task, onCompletePomodoro]);

  if (!isOpen || !task) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = ((initialDuration - timeLeft) / initialDuration) * 100;

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="focus-title"
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl z-10 transition-all text-center"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Deep Work Session</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close focus timer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title & Details */}
        <div className="mb-6">
          <h2 id="focus-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
            {task.title}
          </h2>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <span>{task.category || 'General'}</span>
            <span aria-hidden="true">·</span>
            <span>{task.priority.toUpperCase()} priority</span>
            {task.pomodorosCompleted !== undefined && task.pomodorosCompleted > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  🍅 {task.pomodorosCompleted} {task.pomodorosCompleted === 1 ? 'session' : 'sessions'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1 mb-6 max-w-xs mx-auto">
          <button
            onClick={() => setMode('work')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'work'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Break (5m)
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Long (15m)
          </button>
        </div>

        {/* Big Countdown Display */}
        <div className="relative my-4">
          <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {formattedTime}
          </div>

          {/* Progress bar */}
          <div className="w-48 mx-auto mt-4 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                mode === 'work'
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handleReset}
            className="p-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleTaskComplete(task.id)}
            className={`p-3 rounded-2xl transition-colors cursor-pointer ${
              task.completed
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
            title={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle / Tip */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-slate-400" />
          <span>Sound alert chimes automatically when the session finishes.</span>
        </div>
      </div>
    </div>
  );
}
