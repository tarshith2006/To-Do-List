import { useEffect } from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Enter', description: 'Submit new task or save active edit' },
  { key: 'Esc', description: 'Cancel task edit or close modal' },
  { key: '/', description: 'Quick jump to Search bar' },
  { key: 'V', description: 'Toggle between List view and Kanban Board' },
  { key: 'T', description: 'Toggle Light / Dark mode' },
  { key: '?', description: 'Open this keyboard shortcuts helper' },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl z-10 transition-all"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 id="shortcuts-title" className="text-sm font-bold text-slate-900 dark:text-white">
              Keyboard Shortcuts & Tips
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {SHORTCUTS.map(sc => (
            <div
              key={sc.key}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs"
            >
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {sc.description}
              </span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>Productivity tip: Click subtasks to track granular progress</span>
          </span>
          <button
            onClick={onClose}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
