import { Task, TaskStatus } from '../types/todo';
import { formatDueDate } from '../utils/storage';
import { Check, Calendar, Target, Clock, ArrowRight, ArrowLeft, Trash2, Edit2, AlertTriangle } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEditTask: (id: string) => void;
  onDeleteRequest: (task: Task) => void;
  onLaunchFocus: (task: Task) => void;
}

export function TaskBoard({
  tasks,
  onToggleTask,
  onStatusChange,
  onEditTask,
  onDeleteRequest,
  onLaunchFocus,
}: TaskBoardProps) {
  const todoTasks = tasks.filter(t => !t.completed && (t.status === 'todo' || !t.status));
  const inProgressTasks = tasks.filter(t => !t.completed && t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.completed || t.status === 'completed');

  const columns: { id: TaskStatus; title: string; color: string; list: Task[] }[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-300 dark:border-slate-700', list: todoTasks },
    { id: 'in-progress', title: 'In Progress', color: 'border-blue-400 dark:border-blue-600', list: inProgressTasks },
    { id: 'completed', title: 'Completed', color: 'border-emerald-400 dark:border-emerald-600', list: completedTasks },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
      {columns.map(col => (
        <div
          key={col.id}
          className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col h-full min-h-[360px]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                col.id === 'todo'
                  ? 'bg-slate-400'
                  : col.id === 'in-progress'
                  ? 'bg-blue-500'
                  : 'bg-emerald-500'
              }`} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {col.title}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs tabular-nums">
              {col.list.length}
            </span>
          </div>

          {/* Cards Container */}
          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
            {col.list.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No tasks
              </div>
            ) : (
              col.list.map(task => {
                const dueDateInfo = formatDueDate(task.dueDate);
                const isOverdue = !task.completed && Boolean(dueDateInfo?.isOverdue);
                const isDueToday = !task.completed && Boolean(dueDateInfo?.isToday);
                const subtasks = task.subtasks || [];
                const completedSubtasks = subtasks.filter(st => st.completed).length;

                return (
                  <div
                    key={task.id}
                    className={`rounded-xl p-3 shadow-2xs transition-all border ${
                      task.completed
                        ? 'border-slate-200 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/60 opacity-75'
                        : isOverdue
                        ? 'border-l-4 border-l-rose-500 border-rose-300 dark:border-rose-900/70 bg-rose-50/60 dark:bg-rose-950/30'
                        : isDueToday
                        ? 'border-l-4 border-l-amber-500 border-amber-300 dark:border-amber-800/70 bg-amber-50/60 dark:bg-amber-950/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:shadow-xs'
                    }`}
                  >
                    {/* Top Row: Priority, Alert Badges & Actions */}
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isOverdue && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/70 border border-rose-300 dark:border-rose-800 px-1.5 py-0.5 rounded shadow-2xs">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" />
                            <span>OVERDUE</span>
                          </span>
                        )}

                        {isDueToday && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/70 border border-amber-300 dark:border-amber-800 px-1.5 py-0.5 rounded shadow-2xs">
                            <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                            <span>DUE TODAY</span>
                          </span>
                        )}

                        <span className={`w-2 h-2 rounded-full ${
                          task.priority === 'high'
                            ? 'bg-rose-500'
                            : task.priority === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`} />
                        <span className="capitalize font-medium text-slate-600 dark:text-slate-400">
                          {task.priority}
                        </span>
                        {task.category && (
                          <span className="text-slate-400">· {task.category}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditTask(task.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteRequest(task)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Task Title */}
                    <h4
                      onClick={() => onToggleTask(task.id)}
                      className={`text-xs font-semibold cursor-pointer mb-2 leading-relaxed ${
                        task.completed
                          ? 'line-through text-slate-400'
                          : isOverdue
                          ? 'text-rose-950 dark:text-rose-100 hover:text-rose-700'
                          : isDueToday
                          ? 'text-amber-950 dark:text-amber-100 hover:text-amber-700'
                          : 'text-slate-900 dark:text-white hover:text-blue-600'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Meta info: Subtasks & Due Date */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      {subtasks.length > 0 && (
                        <span>
                          {completedSubtasks}/{subtasks.length} subtasks
                        </span>
                      )}
                      {dueDateInfo && (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded font-medium ${
                            task.completed
                              ? 'text-slate-400'
                              : isOverdue
                              ? 'text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800'
                              : isDueToday
                              ? 'text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {isOverdue ? (
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                          ) : isDueToday ? (
                            <Clock className="w-3 h-3 text-amber-600" />
                          ) : (
                            <Calendar className="w-3 h-3" />
                          )}
                          <span>{dueDateInfo.text}</span>
                        </span>
                      )}
                      {task.estimatedMinutes && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedMinutes}m</span>
                        </span>
                      )}
                    </div>

                    {/* Workflow status switcher bar */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      {!task.completed && (
                        <button
                          onClick={() => onLaunchFocus(task)}
                          className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Target className="w-3 h-3" />
                          <span>Focus</span>
                        </button>
                      )}

                      <div className="flex items-center gap-1 ml-auto">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => onStatusChange(task.id, col.id === 'completed' ? 'in-progress' : 'todo')}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            title="Move left"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {col.id !== 'completed' && (
                          <button
                            onClick={() => onStatusChange(task.id, col.id === 'todo' ? 'in-progress' : 'completed')}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            title="Move right"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {col.id === 'completed' && (
                          <button
                            onClick={() => onToggleTask(task.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-700 rounded cursor-pointer"
                            title="Toggle completed"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
