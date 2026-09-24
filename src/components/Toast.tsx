import { CheckCircle, AlertCircle, Info, X, Undo2 } from 'lucide-react';
import { ToastNotification } from '../hooks/useTodos';

interface ToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 max-w-sm w-full pointer-events-none">
      <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-xl p-3 shadow-xl border border-slate-700/50 flex items-center justify-between gap-3 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-center gap-2.5 min-w-0">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span className="text-xs font-medium truncate">{toast.message}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction?.();
                onDismiss();
              }}
              className="px-2 py-1 text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-slate-700 rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
