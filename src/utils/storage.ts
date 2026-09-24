import { Task } from '../types/todo';
import { INITIAL_SAMPLE_TASKS } from './sampleData';

const TASKS_STORAGE_KEY = 'interactive_todo_tasks_v2';
const THEME_STORAGE_KEY = 'interactive_todo_theme';

/**
 * Load tasks from LocalStorage safely with fallback to sample data if first visit.
 */
export function loadTasksFromStorage(): Task[] {
  try {
    const rawData = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!rawData) {
      // First time user: seed with initial demo tasks so user sees immediate value
      saveTasksToStorage(INITIAL_SAMPLE_TASKS);
      return INITIAL_SAMPLE_TASKS;
    }

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('LocalStorage data is not an array, resetting to sample tasks.');
      return INITIAL_SAMPLE_TASKS;
    }

    // Sanitize items to ensure all required fields exist
    return parsed.map((item, index) => {
      const completed = Boolean(item.completed);
      const rawStatus = item.status;
      const status = rawStatus === 'in-progress' || rawStatus === 'todo' || rawStatus === 'completed'
        ? rawStatus
        : completed ? 'completed' : 'todo';

      const subtasks = Array.isArray(item.subtasks)
        ? item.subtasks.map((st: { id?: string; title?: string; completed?: boolean }, sIdx: number) => ({
            id: String(st.id || `st-${index}-${sIdx}`),
            title: String(st.title || '').trim(),
            completed: Boolean(st.completed),
          }))
        : [];

      return {
        id: String(item.id || `task-${Date.now()}-${index}`),
        title: String(item.title || 'Untitled Task').trim(),
        completed,
        status,
        priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
        dueDate: typeof item.dueDate === 'string' ? item.dueDate : undefined,
        category: item.category || 'General',
        notes: typeof item.notes === 'string' ? item.notes : undefined,
        estimatedMinutes: typeof item.estimatedMinutes === 'number' ? item.estimatedMinutes : undefined,
        pomodorosCompleted: typeof item.pomodorosCompleted === 'number' ? item.pomodorosCompleted : 0,
        subtasks,
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
        completedAt: typeof item.completedAt === 'string' ? item.completedAt : undefined,
      };
    });
  } catch (error) {
    console.error('Failed to load tasks from LocalStorage:', error);
    return INITIAL_SAMPLE_TASKS;
  }
}

/**
 * Save tasks to LocalStorage safely.
 */
export function saveTasksToStorage(tasks: Task[]): boolean {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Failed to save tasks to LocalStorage:', error);
    return false;
  }
}

/**
 * Load theme from LocalStorage ('light' | 'dark').
 */
export function loadThemeFromStorage(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

/**
 * Save theme to LocalStorage.
 */
export function saveThemeToStorage(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme in LocalStorage:', error);
  }
}

/**
 * Format date for display: "25 Sep" or "Today" or "Overdue"
 */
export function formatDueDate(dateString?: string): { text: string; isOverdue: boolean; isToday: boolean } | null {
  if (!dateString) return null;
  
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return { text: dateString, isOverdue: false, isToday: false };
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = `${day} ${monthNames[month]}`;
    
    if (diffDays === 0) {
      return { text: 'Due Today', isOverdue: false, isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', isOverdue: false, isToday: false };
    } else if (diffDays < 0) {
      return { text: `Overdue (${formatted})`, isOverdue: true, isToday: false };
    } else {
      return { text: `Due: ${formatted}`, isOverdue: false, isToday: false };
    }
  } catch {
    return { text: dateString, isOverdue: false, isToday: false };
  }
}
