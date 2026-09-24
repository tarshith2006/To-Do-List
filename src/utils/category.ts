import { TaskCategory } from '../types/todo';

export interface CategoryMeta {
  name: TaskCategory;
  label: string;
  badgeClass: string;
  dotColor: string;
}

export const CATEGORY_CONFIG: Record<TaskCategory, CategoryMeta> = {
  Personal: {
    name: 'Personal',
    label: 'Personal',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    dotColor: 'bg-purple-500',
  },
  Work: {
    name: 'Work',
    label: 'Work',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    dotColor: 'bg-blue-500',
  },
  Shopping: {
    name: 'Shopping',
    label: 'Shopping',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    dotColor: 'bg-emerald-500',
  },
  Study: {
    name: 'Study',
    label: 'Study',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    dotColor: 'bg-indigo-500',
  },
  Health: {
    name: 'Health',
    label: 'Health',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    dotColor: 'bg-rose-500',
  },
  Other: {
    name: 'Other',
    label: 'Other',
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    dotColor: 'bg-slate-500',
  },
};

export function getCategoryBadge(category?: TaskCategory | string): CategoryMeta {
  if (category && category in CATEGORY_CONFIG) {
    return CATEGORY_CONFIG[category as TaskCategory];
  }
  return CATEGORY_CONFIG.Other;
}
