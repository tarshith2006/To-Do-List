import { Task } from '../types/todo';

const today = new Date().toISOString().split('T')[0];
const overdueDate = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]; // 2 days ago

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'task-sample-overdue',
    title: 'Submit Database lab report & ER diagrams',
    completed: false,
    status: 'in-progress',
    priority: 'high',
    dueDate: overdueDate,
    category: 'Study',
    estimatedMinutes: 45,
    pomodorosCompleted: 1,
    notes: 'Upload PDF to university portal. Ensure 3NF schema diagrams are attached.',
    subtasks: [
      { id: 'sub-od-1', title: 'Export PDF from Lucidchart', completed: true },
      { id: 'sub-od-2', title: 'Verify normalization explanations', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'task-sample-today',
    title: 'Complete DSA assignment on Binary Search Trees',
    completed: false,
    status: 'in-progress',
    priority: 'high',
    dueDate: today, // Due Today!
    category: 'Study',
    estimatedMinutes: 60,
    pomodorosCompleted: 1,
    notes: 'Reference Chapter 7 in Cormen book. Implement insert, delete, and in-order traversal with tests.',
    subtasks: [
      { id: 'sub-1', title: 'Implement Node struct and insertion logic', completed: true },
      { id: 'sub-2', title: 'Write node deletion with 3 case handling', completed: false },
      { id: 'sub-3', title: 'Add test cases for edge boundary conditions', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'task-sample-2',
    title: 'Practice JavaScript DOM manipulation & event handling',
    completed: true,
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    category: 'Study',
    estimatedMinutes: 45,
    pomodorosCompleted: 2,
    notes: 'Built interactive to-do list with LocalStorage and responsive dark mode.',
    subtasks: [
      { id: 'sub-4', title: 'Understand Event Delegation and bubbling', completed: true },
      { id: 'sub-5', title: 'Inspect LocalStorage size limits and JSON serialization', completed: true },
    ],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'task-sample-3',
    title: 'Build Portfolio project showcase page',
    completed: false,
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    category: 'Work',
    estimatedMinutes: 90,
    pomodorosCompleted: 0,
    notes: 'Include live demo URLs, GitHub repository links, and tech stack tags.',
    subtasks: [
      { id: 'sub-6', title: 'Design layout wireframe in Figma', completed: true },
      { id: 'sub-7', title: 'Write responsive CSS grid container', completed: false },
      { id: 'sub-8', title: 'Deploy on Vercel or GitHub Pages', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'task-sample-4',
    title: 'Practice Python algorithm challenges on LeetCode',
    completed: false,
    status: 'todo',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    category: 'Personal',
    estimatedMinutes: 30,
    notes: 'Focus on sliding window and two-pointer problems (Medium difficulty).',
    subtasks: [
      { id: 'sub-9', title: 'Solve 2 Two-Sum variations', completed: false },
      { id: 'sub-10', title: 'Review time complexity analysis', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];
