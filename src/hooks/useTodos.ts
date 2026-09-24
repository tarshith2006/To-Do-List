import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  FilterStatus,
  SortOption,
  TaskStats,
  Priority,
  TaskCategory,
  TaskStatus,
  ViewMode,
} from '../types/todo';
import { loadTasksFromStorage, saveTasksToStorage, formatDueDate } from '../utils/storage';
import { INITIAL_SAMPLE_TASKS } from '../utils/sampleData';
import { playCompletionSound, isSoundEnabled, setSoundEnabled as saveSoundPref } from '../utils/sound';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  undoAction?: () => void;
}

const VIEW_MODE_KEY = 'interactive_todo_view_mode';

export function useTodos() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [soundActive, setSoundActive] = useState<boolean>(() => isSoundEnabled());

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem(VIEW_MODE_KEY);
      return stored === 'board' ? 'board' : 'list';
    } catch {
      return 'list';
    }
  });

  const toggleViewMode = useCallback((mode?: ViewMode) => {
    setViewMode(prev => {
      const next = mode || (prev === 'list' ? 'board' : 'list');
      try {
        localStorage.setItem(VIEW_MODE_KEY, next);
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundActive(prev => {
      const next = !prev;
      saveSoundPref(next);
      return next;
    });
  }, []);

  // Sync to LocalStorage on tasks state change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Show a temporary toast message
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info', undoAction?: () => void) => {
    const id = String(Date.now());
    setToast({ id, message, type, undoAction });
    const timer = setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, undoAction ? 6000 : 3500);
    return () => clearTimeout(timer);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Add Task with validation & optional extended fields
  const addTask = useCallback((
    title: string,
    priority: Priority = 'medium',
    dueDate?: string,
    category: TaskCategory = 'General' as TaskCategory,
    notes?: string,
    estimatedMinutes?: number
  ): { success: boolean; error?: string } => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return { success: false, error: 'Please enter a task title.' };
    }

    if (trimmedTitle.length > 200) {
      return { success: false, error: 'Task title must be 200 characters or fewer.' };
    }

    // Check duplicate in pending tasks
    const isDuplicate = tasks.some(
      t => !t.completed && t.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'An active task with this exact name already exists.' };
    }

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: trimmedTitle,
      completed: false,
      status: 'todo',
      priority,
      dueDate: dueDate || undefined,
      category,
      notes: notes?.trim() || undefined,
      estimatedMinutes: estimatedMinutes && estimatedMinutes > 0 ? estimatedMinutes : undefined,
      pomodorosCompleted: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    showToast('Task added successfully', 'success');
    return { success: true };
  }, [tasks, showToast]);

  // Toggle Task Completion
  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            playCompletionSound();
          }
          return {
            ...task,
            completed: nextCompleted,
            status: nextCompleted ? 'completed' : 'todo',
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  // Explicitly update task status (todo | in-progress | completed)
  const setTaskStatus = useCallback((id: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const completed = newStatus === 'completed';
          if (completed && !task.completed) {
            playCompletionSound();
          }
          return {
            ...task,
            status: newStatus,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  // Edit Task
  const editTask = useCallback((
    id: string,
    updates: Partial<Pick<Task, 'title' | 'priority' | 'dueDate' | 'category' | 'notes' | 'estimatedMinutes' | 'status'>>
  ): { success: boolean; error?: string } => {
    if (updates.title !== undefined) {
      const trimmedTitle = updates.title.trim();
      if (!trimmedTitle) {
        return { success: false, error: 'Task title cannot be empty.' };
      }
      if (trimmedTitle.length > 200) {
        return { success: false, error: 'Task title must be 200 characters or fewer.' };
      }
      updates.title = trimmedTitle;
    }

    if (updates.notes !== undefined) {
      updates.notes = updates.notes.trim() || undefined;
    }

    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextStatus = updates.status !== undefined ? updates.status : task.status;
          const isCompleted = nextStatus === 'completed';
          return {
            ...task,
            ...updates,
            completed: isCompleted,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );

    showToast('Task updated successfully', 'success');
    return { success: true };
  }, [showToast]);

  // Subtask Management
  const addSubtask = useCallback((taskId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const subtasks = task.subtasks || [];
          const newSubtask = {
            id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: trimmed,
            completed: false,
          };
          return {
            ...task,
            subtasks: [...subtasks, newSubtask],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const subtasks = (task.subtasks || []).map(st => {
            if (st.id === subtaskId) {
              const nextDone = !st.completed;
              if (nextDone) playCompletionSound();
              return { ...st, completed: nextDone };
            }
            return st;
          });
          return {
            ...task,
            subtasks,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: (task.subtasks || []).filter(st => st.id !== subtaskId),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  // Increment Pomodoro Focus Count for Task
  const incrementPomodoro = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const current = task.pomodorosCompleted || 0;
          return {
            ...task,
            pomodorosCompleted: current + 1,
            status: task.status === 'todo' ? 'in-progress' : task.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  // Delete Task with undo capability
  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== id));

    showToast(
      `Deleted "${taskToDelete.title.length > 25 ? taskToDelete.title.slice(0, 25) + '...' : taskToDelete.title}"`,
      'info',
      () => {
        // Undo callback
        setTasks(prev => [taskToDelete, ...prev]);
      }
    );
  }, [tasks, showToast]);

  // Clear Completed Tasks
  const clearCompleted = useCallback(() => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    setTasks(prev => prev.filter(t => !t.completed));
    showToast(
      `Cleared ${completedTasks.length} completed ${completedTasks.length === 1 ? 'task' : 'tasks'}`,
      'info',
      () => {
        setTasks(prev => [...prev, ...completedTasks]);
      }
    );
  }, [tasks, showToast]);

  // Reset to initial sample tasks
  const resetToSampleTasks = useCallback(() => {
    setTasks(INITIAL_SAMPLE_TASKS);
    showToast('Loaded demo student tasks', 'success');
  }, [showToast]);

  // Export Tasks as JSON
  const exportTasks = useCallback(() => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(tasks, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `tasks-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported tasks to JSON file', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to export tasks', 'error');
    }
  }, [tasks, showToast]);

  // Import Tasks from JSON
  const importTasks = useCallback(async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (!Array.isArray(parsed)) {
            resolve({ success: false, message: 'Invalid file format: must be an array of tasks.' });
            return;
          }
          const validTasks: Task[] = parsed.map((item, idx) => ({
            id: String(item.id || `imported-${Date.now()}-${idx}`),
            title: String(item.title || 'Untitled').trim(),
            completed: Boolean(item.completed),
            status: item.status || (item.completed ? 'completed' : 'todo'),
            priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
            dueDate: item.dueDate || undefined,
            category: item.category || 'General',
            notes: item.notes || undefined,
            estimatedMinutes: item.estimatedMinutes || undefined,
            pomodorosCompleted: item.pomodorosCompleted || 0,
            subtasks: Array.isArray(item.subtasks) ? item.subtasks : [],
            createdAt: item.createdAt || new Date().toISOString(),
          }));

          setTasks(validTasks);
          showToast(`Imported ${validTasks.length} tasks successfully`, 'success');
          resolve({ success: true, message: `Imported ${validTasks.length} tasks.` });
        } catch {
          resolve({ success: false, message: 'Failed to parse JSON file.' });
        }
      };
      reader.readAsText(file);
    });
  }, [showToast]);

  // Statistics calculation
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const inProgress = tasks.filter(t => !t.completed && t.status === 'in-progress').length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'high').length;
    
    let overdueCount = 0;
    let dueTodayCount = 0;
    let totalEstimatedMinutes = 0;

    const todayStr = new Date().toISOString().split('T')[0];

    tasks.forEach(t => {
      if (!t.completed && t.estimatedMinutes) {
        totalEstimatedMinutes += t.estimatedMinutes;
      }
      if (!t.completed && t.dueDate) {
        const formatted = formatDueDate(t.dueDate);
        if (formatted?.isOverdue) overdueCount++;
        if (formatted?.isToday) dueTodayCount++;
      }
    });

    const completedTodayCount = tasks.filter(t => {
      if (!t.completed) return false;
      const compDate = t.completedAt ? t.completedAt.split('T')[0] : t.updatedAt?.split('T')[0];
      return compDate === todayStr;
    }).length;

    return {
      total,
      completed,
      pending,
      inProgress,
      percentage,
      highPriorityPending,
      overdueCount,
      dueTodayCount,
      totalEstimatedMinutes,
      completedTodayCount,
    };
  }, [tasks]);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by completion status / in-progress
    if (filter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (filter === 'in-progress') {
      result = result.filter(t => !t.completed && t.status === 'in-progress');
    } else if (filter === 'completed') {
      result = result.filter(t => t.completed);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Filter by search query (searches title, category, notes, and subtask titles)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.subtasks && t.subtasks.some(st => st.title.toLowerCase().includes(q)))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'timeEstimate') {
        return (b.estimatedMinutes || 0) - (a.estimatedMinutes || 0);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });

    return result;
  }, [tasks, filter, priorityFilter, searchQuery, sortBy]);

  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    toggleViewMode,
    soundActive,
    toggleSound,
    stats,
    addTask,
    toggleTask,
    setTaskStatus,
    editTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    incrementPomodoro,
    deleteTask,
    clearCompleted,
    resetToSampleTasks,
    exportTasks,
    importTasks,
    toast,
    dismissToast,
  };
}
