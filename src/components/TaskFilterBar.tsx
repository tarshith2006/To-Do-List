import { FilterStatus, Priority, SortOption, ViewMode, TaskCategory, TASK_CATEGORIES } from '../types/todo';
import { Search, X, SlidersHorizontal, ArrowUpDown, LayoutList, Kanban, Tag } from 'lucide-react';
import { CATEGORY_CONFIG } from '../utils/category';

interface TaskFilterBarProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  priorityFilter: 'all' | Priority;
  onPriorityFilterChange: (priority: 'all' | Priority) => void;
  categoryFilter: 'all' | TaskCategory;
  onCategoryFilterChange: (category: 'all' | TaskCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode?: ViewMode) => void;
  totalCount: number;
  activeCount: number;
  inProgressCount: number;
  completedCount: number;
}

export function TaskFilterBar({
  filter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onToggleViewMode,
  totalCount,
  activeCount,
  inProgressCount,
  completedCount,
}: TaskFilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Top row: Status Tabs & Search Box & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Segmented Controls */}
        <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl gap-1 overflow-x-auto">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All <span className="text-[11px] opacity-75 font-normal">({totalCount})</span>
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'active'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            To Do <span className="text-[11px] opacity-75 font-normal">({activeCount - inProgressCount})</span>
          </button>
          <button
            onClick={() => onFilterChange('in-progress')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'in-progress'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            In Progress <span className="text-[11px] opacity-75 font-normal">({inProgressCount})</span>
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed <span className="text-[11px] opacity-75 font-normal">({completedCount})</span>
          </button>
        </div>

        {/* Dynamic Search Box & View Mode Toggle */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search title, subtasks, notes..."
              className="w-full h-9 pl-9 pr-8 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs transition-all"
              aria-label="Search tasks"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List vs Board Toggle */}
          <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl gap-0.5 shrink-0">
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="List View"
              aria-label="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('board')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Kanban Board View"
              aria-label="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle row: Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs no-scrollbar">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 shrink-0 font-medium">
          <Tag className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-nowrap">
          <button
            onClick={() => onCategoryFilterChange('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            All
          </button>
          {TASK_CATEGORIES.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryFilterChange(cat)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? `${config.badgeClass} ring-1 ring-current font-semibold shadow-2xs`
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Priority Filter & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="font-medium hidden sm:inline">Priority:</span>
          <div className="flex items-center gap-1">
            {(['all', 'high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPriorityFilterChange(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] capitalize font-medium transition-colors cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-7 px-2 bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            aria-label="Sort tasks by"
          >
            <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Newest First</option>
            <option value="oldest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Oldest First</option>
            <option value="dueDate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Due Date</option>
            <option value="priority" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Priority (High to Low)</option>
            <option value="timeEstimate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Estimated Duration</option>
            <option value="alphabetical" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
