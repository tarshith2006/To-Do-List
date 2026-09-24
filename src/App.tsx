/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { Task } from './types/todo';
import { loadThemeFromStorage, saveThemeToStorage } from './utils/storage';
import { Header } from './components/Header';
import { TaskStats } from './components/TaskStats';
import { TaskInput } from './components/TaskInput';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskList } from './components/TaskList';
import { TaskBoard } from './components/TaskBoard';
import { FocusTimerModal } from './components/FocusTimerModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Footer } from './components/Footer';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadThemeFromStorage());

  // Apply theme class to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveThemeToStorage(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
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
  } = useTodos();

  // Modals state
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);
  const [isClearCompletedModalOpen, setIsClearCompletedModalOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if ((e.key === 'v' || e.key === 'V') && !isInput) {
        e.preventDefault();
        toggleViewMode();
      } else if ((e.key === 't' || e.key === 'T') && !isInput) {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        const searchInput = document.querySelector('input[aria-label="Search tasks"]') as HTMLInputElement | null;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [toggleViewMode]);

  // Handler to open focus timer for the top relevant task
  const handleOpenFocusTopTask = () => {
    const targetTask =
      tasks.find(t => !t.completed && t.status === 'in-progress') ||
      tasks.find(t => !t.completed && t.priority === 'high') ||
      tasks.find(t => !t.completed);

    if (targetTask) {
      setFocusTask(targetTask);
    } else if (tasks.length > 0) {
      setFocusTask(tasks[0]);
    } else {
      resetToSampleTasks();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onResetTasks={resetToSampleTasks}
        onExportTasks={exportTasks}
        onImportTasks={importTasks}
        soundActive={soundActive}
        onToggleSound={toggleSound}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenFocus={handleOpenFocusTopTask}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Real-time Statistics & Progress Bar */}
        <TaskStats stats={stats} />

        {/* Input Area (Feature 1) */}
        <section aria-label="Add new task">
          <TaskInput onAddTask={addTask} />
        </section>

        {/* Filters, Live Search, Sort & Kanban/List View Mode (Features 6, 7) */}
        <section aria-label="Filter and search tasks" className="pt-2">
          <TaskFilterBar
            filter={filter}
            onFilterChange={setFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onToggleViewMode={toggleViewMode}
            totalCount={stats.total}
            activeCount={stats.pending}
            inProgressCount={stats.inProgress}
            completedCount={stats.completed}
          />
        </section>

        {/* Main Tasks Presentation: List View or Kanban Board */}
        <section aria-label="Task list or board" className="pt-1">
          {viewMode === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              totalTasksCount={stats.total}
              filter={filter}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              onToggleTask={toggleTask}
              onStatusChange={setTaskStatus}
              onEditTask={editTask}
              onDeleteRequest={(task) => setTaskPendingDelete(task)}
              onLoadDemoTasks={resetToSampleTasks}
              onLaunchFocus={(task) => setFocusTask(task)}
              onAddSubtask={addSubtask}
              onToggleSubtask={toggleSubtask}
              onDeleteSubtask={deleteSubtask}
            />
          ) : (
            <TaskBoard
              tasks={filteredTasks}
              onToggleTask={toggleTask}
              onStatusChange={setTaskStatus}
              onEditTask={(id) => {
                const target = tasks.find(t => t.id === id);
                if (target) {
                  // Switch to list view to edit seamlessly
                  toggleViewMode('list');
                }
              }}
              onDeleteRequest={(task) => setTaskPendingDelete(task)}
              onLaunchFocus={(task) => setFocusTask(task)}
            />
          )}
        </section>

        {/* Bottom Actions & Footer (Feature 9) */}
        <Footer
          stats={stats}
          onClearCompletedRequest={() => setIsClearCompletedModalOpen(true)}
        />
      </main>

      {/* Deep Work Focus Timer Modal */}
      <FocusTimerModal
        task={focusTask}
        isOpen={Boolean(focusTask)}
        onClose={() => setFocusTask(null)}
        onCompletePomodoro={(taskId) => {
          incrementPomodoro(taskId);
        }}
        onToggleTaskComplete={(taskId) => {
          toggleTask(taskId);
          // keep focusTask in sync
          setFocusTask(prev => (prev?.id === taskId ? { ...prev, completed: !prev.completed } : prev));
        }}
      />

      {/* Keyboard Shortcuts Helper Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Confirmation Modal for Single Task Delete */}
      <DeleteConfirmModal
        isOpen={Boolean(taskPendingDelete)}
        title="Delete Task"
        message={
          taskPendingDelete
            ? `Are you sure you want to permanently delete "${taskPendingDelete.title}"?`
            : ''
        }
        confirmLabel="Delete Task"
        onConfirm={() => {
          if (taskPendingDelete) {
            deleteTask(taskPendingDelete.id);
            setTaskPendingDelete(null);
          }
        }}
        onCancel={() => setTaskPendingDelete(null)}
      />

      {/* Confirmation Modal for Clear Completed Tasks */}
      <DeleteConfirmModal
        isOpen={isClearCompletedModalOpen}
        title="Clear Completed Tasks"
        message={`Are you sure you want to remove all ${stats.completed} completed ${
          stats.completed === 1 ? 'task' : 'tasks'
        }?`}
        confirmLabel="Clear All Completed"
        onConfirm={() => {
          clearCompleted();
          setIsClearCompletedModalOpen(false);
        }}
        onCancel={() => setIsClearCompletedModalOpen(false)}
      />

      {/* Notification Toast */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
