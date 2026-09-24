import { Task, FilterStatus, TaskStatus } from '../types/todo';
import { TaskItem } from './TaskItem';
import { CheckCircle, SearchX, PlusCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  filter: FilterStatus;
  searchQuery: string;
  onClearSearch: () => void;
  onToggleTask: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEditTask: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'priority' | 'dueDate' | 'category' | 'notes' | 'estimatedMinutes' | 'status'>>
  ) => { success: boolean; error?: string };
  onDeleteRequest: (task: Task) => void;
  onLoadDemoTasks: () => void;
  onLaunchFocus: (task: Task) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskList({
  tasks,
  totalTasksCount,
  filter,
  searchQuery,
  onClearSearch,
  onToggleTask,
  onStatusChange,
  onEditTask,
  onDeleteRequest,
  onLoadDemoTasks,
  onLaunchFocus,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskListProps) {
  // Empty State: Search produced no results
  if (tasks.length === 0 && searchQuery.trim()) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
          No tasks found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          No tasks match &ldquo;{searchQuery}&rdquo;. Try another term or clear the search.
        </p>
        <button
          onClick={onClearSearch}
          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Clear Search
        </button>
      </div>
    );
  }

  // Empty State: Total tasks is 0
  if (totalTasksCount === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center shadow-xs">
        <div className="text-3xl mb-3" role="img" aria-label="Target icon">
          🎯
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
          No tasks yet!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
          Add your first task above and start being productive, or load sample tasks to explore subtasks, deep work timers, and Kanban boards.
        </p>
        <button
          onClick={onLoadDemoTasks}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-xl border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Load Student Demo Tasks</span>
        </button>
      </div>
    );
  }

  // Empty State: Filter produced 0 results
  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
          {filter === 'active'
            ? 'All caught up!'
            : filter === 'in-progress'
            ? 'No tasks in progress'
            : 'No tasks in this view'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {filter === 'active'
            ? 'You have completed all pending tasks. Outstanding work!'
            : filter === 'in-progress'
            ? 'Start working on a task or move one to in-progress.'
            : 'No tasks meet the currently selected filter.'}
        </p>
      </div>
    );
  }

  // Normal List View
  return (
    <ul className="space-y-2.5" role="list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onStatusChange={onStatusChange}
          onEdit={onEditTask}
          onDeleteRequest={onDeleteRequest}
          onLaunchFocus={onLaunchFocus}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
        />
      ))}
    </ul>
  );
}
