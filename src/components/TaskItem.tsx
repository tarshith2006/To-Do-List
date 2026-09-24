import { useState, useRef, useEffect } from 'react';
import { Task, Priority, TaskCategory, TaskStatus, TASK_CATEGORIES } from '../types/todo';
import { formatDueDate } from '../utils/storage';
import { getCategoryBadge } from '../utils/category';
import {
  Check,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  AlertTriangle,
  Save,
  X,
  Target,
  ChevronDown,
  ChevronRight,
  Plus,
  Clock,
  FileText,
  CheckSquare,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'priority' | 'dueDate' | 'category' | 'notes' | 'estimatedMinutes' | 'status'>>
  ) => { success: boolean; error?: string };
  onDeleteRequest: (task: Task) => void;
  onLaunchFocus: (task: Task) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskItem({
  task,
  onToggle,
  onStatusChange,
  onEdit,
  onDeleteRequest,
  onLaunchFocus,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Editing state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editCategory, setEditCategory] = useState<TaskCategory>(task.category || 'Personal');
  const [editNotes, setEditNotes] = useState(task.notes || '');
  const [editEstimatedMinutes, setEditEstimatedMinutes] = useState<number | undefined>(task.estimatedMinutes);
  const [editError, setEditError] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setEditCategory(task.category || 'Personal');
    setEditNotes(task.notes || '');
    setEditEstimatedMinutes(task.estimatedMinutes);
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = onEdit(task.id, {
      title: editTitle,
      priority: editPriority,
      dueDate: editDueDate || undefined,
      category: editCategory,
      notes: editNotes || undefined,
      estimatedMinutes: editEstimatedMinutes,
    });

    if (result.success) {
      setIsEditing(false);
      setEditError(null);
    } else if (result.error) {
      setEditError(result.error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      handleSaveEdit();
    }
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const dueDateInfo = formatDueDate(task.dueDate);
  const isOverdue = !task.completed && Boolean(dueDateInfo?.isOverdue);
  const isDueToday = !task.completed && Boolean(dueDateInfo?.isToday);

  const subtasks = task.subtasks || [];
  const completedSubtasksCount = subtasks.filter(st => st.completed).length;

  return (
    <li
      className={`group relative rounded-2xl p-3.5 sm:p-4 transition-all duration-200 border ${
        task.completed
          ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500'
          : isOverdue
          ? 'border-l-4 border-l-rose-500 border-rose-300 dark:border-rose-900/70 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs ring-1 ring-rose-200 dark:ring-rose-900/40'
          : isDueToday
          ? 'border-l-4 border-l-amber-500 border-amber-300 dark:border-amber-800/70 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs ring-1 ring-amber-200 dark:ring-amber-900/40'
          : task.status === 'in-progress'
          ? 'border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900 shadow-xs'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs'
      }`}
    >
      {isEditing ? (
        /* Edit Mode */
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) setEditError(null);
              }}
              onKeyDown={handleKeyDown}
              maxLength={200}
              className="flex-1 h-9 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Edit task title"
            />
            <button
              type="submit"
              className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="h-9 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
              title="Cancel (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {editError && (
            <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs pt-1">
            {/* Priority */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Priority:</span>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEditPriority(p)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize cursor-pointer ${
                    editPriority === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Category:</span>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
                className="h-6 px-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {TASK_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Due date */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Due:</span>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="h-6 px-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Estimated Minutes */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Duration:</span>
              <input
                type="number"
                min="0"
                max="480"
                step="5"
                placeholder="mins"
                value={editEstimatedMinutes ?? ''}
                onChange={(e) => setEditEstimatedMinutes(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="w-16 h-6 px-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Edit Notes */}
          <div>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Notes or references..."
              rows={2}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            />
          </div>
        </form>
      ) : (
        /* View Mode */
        <div>
          <div className="flex items-start justify-between gap-3">
            {/* Left: Checkbox + Title + Metadata */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Custom Checkbox */}
              <button
                type="button"
                role="checkbox"
                aria-checked={task.completed}
                onClick={() => onToggle(task.id)}
                className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  task.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : isOverdue
                    ? 'border-rose-400 dark:border-rose-500 hover:border-rose-600 bg-white dark:bg-slate-800'
                    : isDueToday
                    ? 'border-amber-400 dark:border-amber-500 hover:border-amber-600 bg-white dark:bg-slate-800'
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800'
                }`}
                title={task.completed ? 'Mark task incomplete' : 'Mark task completed'}
                aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              {/* Task Title & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    onClick={() => onToggle(task.id)}
                    className={`text-sm font-semibold leading-snug cursor-pointer select-none transition-all break-words ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : isOverdue
                        ? 'text-rose-950 dark:text-rose-100 hover:text-rose-700'
                        : isDueToday
                        ? 'text-amber-950 dark:text-amber-100 hover:text-amber-700'
                        : 'text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {task.title}
                  </span>

                  {/* Visual Alert Badge: Overdue */}
                  {isOverdue && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-800 px-2 py-0.5 rounded-md shadow-2xs">
                      <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>OVERDUE</span>
                    </span>
                  )}

                  {/* Visual Alert Badge: Due Today */}
                  {isDueToday && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded-md shadow-2xs">
                      <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>DUE TODAY</span>
                    </span>
                  )}

                  {/* Status chip if in progress */}
                  {!task.completed && task.status === 'in-progress' && (
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      In Progress
                    </span>
                  )}
                </div>

                {/* Clean unboxed metadata with subtle typographic separators */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {/* Priority indicator */}
                  {task.priority === 'high' && (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      High Priority
                    </span>
                  )}
                  {task.priority === 'medium' && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Medium
                    </span>
                  )}
                  {task.priority === 'low' && (
                    <span className="text-slate-500 dark:text-slate-400">
                      Low
                    </span>
                  )}

                  {/* Due Date Indicator with Alert Highlighting */}
                  {dueDateInfo && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-semibold ${
                          task.completed
                            ? 'text-slate-400'
                            : isOverdue
                            ? 'text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800'
                            : isDueToday
                            ? 'text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isOverdue ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        ) : isDueToday ? (
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Calendar className="w-3 h-3" />
                        )}
                        <span>{dueDateInfo.text}</span>
                      </span>
                    </>
                  )}

                  {/* Category Badge */}
                  {task.category && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs ${getCategoryBadge(task.category).badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getCategoryBadge(task.category).dotColor}`} />
                        <span>{task.category}</span>
                      </span>
                    </>
                  )}

                  {/* Time Estimate */}
                  {task.estimatedMinutes && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedMinutes}m</span>
                      </span>
                    </>
                  )}

                  {/* Pomodoros completed badge */}
                  {task.pomodorosCompleted !== undefined && task.pomodorosCompleted > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        🍅 {task.pomodorosCompleted}
                      </span>
                    </>
                  )}

                  {/* Subtask count badge */}
                  {subtasks.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <CheckSquare className="w-3 h-3" />
                        <span>
                          {completedSubtasksCount}/{subtasks.length} subtasks
                        </span>
                      </button>
                    </>
                  )}

                  {/* Notes indicator */}
                  {task.notes && (
                    <>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        title="View notes"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Notes</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Focus Button */}
              {!task.completed && (
                <button
                  onClick={() => onLaunchFocus(task)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer"
                  title="Start Pomodoro deep work session for this task"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Focus</span>
                </button>
              )}

              {/* Expand subtasks/details button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={isExpanded ? 'Hide subtasks & details' : 'Show subtasks & details'}
                aria-label="Toggle details"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {/* Edit button */}
              <button
                onClick={handleStartEdit}
                className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Edit task"
                aria-label={`Edit ${task.title}`}
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete button */}
              <button
                onClick={() => onDeleteRequest(task)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                title="Delete task"
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Section: Notes + Subtasks checklist */}
          {isExpanded && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              {/* Task Notes display */}
              {task.notes && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                  <div className="font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Notes:</span>
                  </div>
                  {task.notes}
                </div>
              )}

              {/* Subtasks Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>Subtasks ({completedSubtasksCount}/{subtasks.length})</span>
                  </span>
                  {!task.completed && (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400 font-normal">Workflow:</span>
                      <select
                        value={task.status || 'todo'}
                        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                        className="h-6 px-1.5 text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Subtask list */}
                {subtasks.length > 0 && (
                  <ul className="space-y-1.5 pl-1">
                    {subtasks.map(st => (
                      <li key={st.id} className="flex items-center justify-between group/st text-xs py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => onToggleSubtask(task.id, st.id)}
                            className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={`break-words ${st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {st.title}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => onDeleteSubtask(task.id, st.id)}
                          className="opacity-0 group-hover/st:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity cursor-pointer"
                          title="Delete subtask"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add new subtask form */}
                <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask step..."
                    className="flex-1 h-7 px-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newSubtaskTitle.trim()}
                    className="h-7 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
