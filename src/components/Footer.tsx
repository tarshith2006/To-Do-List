import { Trash2 } from 'lucide-react';
import { TaskStats } from '../types/todo';

interface FooterProps {
  stats: TaskStats;
  onClearCompletedRequest: () => void;
}

export function Footer({ stats, onClearCompletedRequest }: FooterProps) {
  const hasCompleted = stats.completed > 0;

  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
      {/* Quick Summary Counts */}
      <div className="flex items-center gap-3">
        <span>
          Total: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{stats.total}</strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Completed: <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">{stats.completed}</strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Pending: <strong className="text-amber-600 dark:text-amber-400 tabular-nums">{stats.pending}</strong>
        </span>
      </div>

      {/* Clear Completed Button */}
      <div>
        <button
          onClick={onClearCompletedRequest}
          disabled={!hasCompleted}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            hasCompleted
              ? 'text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer'
              : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title={hasCompleted ? 'Remove all completed tasks' : 'No completed tasks to clear'}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Completed {hasCompleted && `(${stats.completed})`}</span>
        </button>
      </div>
    </footer>
  );
}
