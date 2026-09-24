export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 'Study' | 'Work' | 'Personal' | 'Other';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status?: TaskStatus;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  category?: TaskCategory;
  notes?: string;
  estimatedMinutes?: number;
  pomodorosCompleted?: number;
  subtasks?: Subtask[];
  createdAt: string; // ISO string
  updatedAt?: string;
  completedAt?: string;
}

export type FilterStatus = 'all' | 'active' | 'in-progress' | 'completed';

export type ViewMode = 'list' | 'board';

export type SortOption = 'newest' | 'oldest' | 'dueDate' | 'priority' | 'alphabetical' | 'timeEstimate';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  percentage: number;
  highPriorityPending: number;
  overdueCount: number;
  dueTodayCount: number;
  totalEstimatedMinutes: number;
  completedTodayCount: number;
}
