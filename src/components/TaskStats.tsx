import { TaskStats as ITaskStats } from '../types/todo';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  PlayCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface TaskStatsProps {
  stats: ITaskStats;
}

export function TaskStats({ stats }: TaskStatsProps) {
  // Format total estimated minutes into "Xh Ym"
  const formatTime = (minutes: number) => {
    if (minutes <= 0) return '0m';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  const hasOverdue = stats.overdueCount > 0;

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
      {/* Top primary metrics row (5 responsive columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 divide-y sm:divide-y-0 divide-slate-100 dark:divide-slate-800">
        {/* 1. Total Tasks */}
        <div className="flex flex-col items-start pt-1 sm:pt-0 sm:pr-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <ListTodo className="w-3.5 h-3.5" />
            <span className="font-medium">Total Tasks</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {stats.total}
          </div>
        </div>

        {/* 2. In Progress Tasks */}
        <div className="flex flex-col items-start pt-1 sm:pt-0 sm:px-2 border-slate-100 dark:border-slate-800 sm:border-l">
          <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mb-1">
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="font-medium">In Progress</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">
            {stats.inProgress}
          </div>
        </div>

        {/* 3. Completed Tasks */}
        <div className="flex flex-col items-start pt-3 sm:pt-0 sm:px-2 border-slate-100 dark:border-slate-800 sm:border-l">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-medium">Completed</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.completed}
          </div>
        </div>

        {/* 4. Pending Workload */}
        <div className="flex flex-col items-start pt-3 sm:pt-0 sm:px-2 border-slate-100 dark:border-slate-800 lg:border-l">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">Pending Workload</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {stats.totalEstimatedMinutes > 0 ? (
              <span title={`${stats.pending} pending tasks`}>
                {formatTime(stats.totalEstimatedMinutes)}
              </span>
            ) : (
              <span>{stats.pending}</span>
            )}
          </div>
        </div>

        {/* 5. Overdue Tasks (Dedicated Metric Card) */}
        <div
          className={`flex flex-col items-start pt-3 sm:pt-0 sm:px-2 border-slate-100 dark:border-slate-800 sm:border-l transition-colors rounded-xl ${
            hasOverdue
              ? 'bg-rose-50/70 dark:bg-rose-950/40 p-2 sm:p-2 -m-1 sm:-m-1 border border-rose-200 dark:border-rose-900/60'
              : ''
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">Overdue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight tabular-nums ${
                hasOverdue
                  ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {stats.overdueCount}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {hasOverdue ? 'Action needed' : 'All clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-medium">Overall Progress</span>
            {stats.completedTodayCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3 h-3" />
                <span>{stats.completedTodayCount} done today</span>
              </span>
            )}
          </div>
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {stats.percentage}% Completed
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Urgent Visual Alert Banners: Overdue & Due Today */}
      {(hasOverdue || stats.dueTodayCount > 0 || stats.highPriorityPending > 0) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5 text-xs">
          {/* Overdue Urgent Alert Banner */}
          {hasOverdue && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 font-semibold shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>
                {stats.overdueCount} {stats.overdueCount === 1 ? 'task is overdue' : 'tasks are overdue'} &mdash; prioritize now
              </span>
            </div>
          )}

          {/* Due Today Alert Banner */}
          {stats.dueTodayCount > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-semibold shadow-2xs">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {stats.dueTodayCount} {stats.dueTodayCount === 1 ? 'task due today' : 'tasks due today'}
              </span>
            </div>
          )}

          {/* High Priority Notice */}
          {stats.highPriorityPending > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-600 dark:text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>
                {stats.highPriorityPending} high-priority {stats.highPriorityPending === 1 ? 'task' : 'tasks'} waiting
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
