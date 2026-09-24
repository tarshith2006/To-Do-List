import { useState, useRef } from 'react';
import { Priority, TaskCategory } from '../types/todo';
import { Plus, Calendar, Tag, AlertCircle, Clock, FileText } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (
    title: string,
    priority: Priority,
    dueDate?: string,
    category?: TaskCategory,
    notes?: string,
    estimatedMinutes?: number
  ) => { success: boolean; error?: string };
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState<TaskCategory>('General' as TaskCategory);
  const [notes, setNotes] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined);
  const [showOptions, setShowOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrorMessage(null);
    const result = onAddTask(
      title,
      priority,
      dueDate || undefined,
      category,
      notes || undefined,
      estimatedMinutes
    );

    if (result.success) {
      setTitle('');
      setDueDate('');
      setPriority('medium');
      setNotes('');
      setEstimatedMinutes(undefined);
      setErrorMessage(null);
      inputRef.current?.focus();
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Helper date buttons
  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Input Row */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter your task... (e.g. Complete DSA assignment)"
              maxLength={200}
              className={`w-full h-11 px-4 text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                errorMessage
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/30'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'
              } rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-3 transition-all`}
              aria-label="New task title"
            />
            {title.length > 150 && (
              <span className="absolute right-3 top-3 text-[11px] text-slate-400 tabular-nums">
                {title.length}/200
              </span>
            )}
          </div>

          <button
            type="submit"
            className="h-11 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            disabled={!title.trim()}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Validation Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Secondary controls toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{showOptions ? 'Hide details' : '+ Schedule, Priority & Notes'}</span>
            </button>
            {dueDate && !showOptions && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                · Due: {dueDate}
              </span>
            )}
            {priority !== 'medium' && !showOptions && (
              <span className={`text-xs ${priority === 'high' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400'}`}>
                · {priority.toUpperCase()}
              </span>
            )}
            {estimatedMinutes && !showOptions && (
              <span className="text-xs text-purple-600 dark:text-purple-400">
                · ⏱ {estimatedMinutes}m
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]">Enter ↵</kbd> to add
          </div>
        </div>

        {/* Expandable Options: Priority, Due Date with Quick Presets, Category, Notes, Estimate */}
        {showOptions && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Priority
                </label>
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg gap-1">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                        priority === p
                          ? p === 'high'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : p === 'low'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date Input with Quick Shortcuts */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Due Date
                </label>
                <div className="space-y-1.5">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(7)}
                      className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                    >
                      Next Week
                    </button>
                  </div>
                </div>
              </div>

              {/* Category & Time Estimate */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Category & Duration
                </label>
                <div className="space-y-1.5">
                  <div className="relative flex items-center">
                    <Tag className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TaskCategory)}
                      className="w-full h-8 pl-8 pr-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Study">Study</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {[15, 30, 45, 60].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setEstimatedMinutes(estimatedMinutes === mins ? undefined : mins)}
                        className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer transition-colors ${
                          estimatedMinutes === mins
                            ? 'bg-purple-600 text-white font-medium'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes field */}
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Notes / Checklist context (optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add links, references, or instructions for this task..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
