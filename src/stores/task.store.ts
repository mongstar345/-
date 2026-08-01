import { create } from 'zustand';
import { Task, TaskStats } from '../types';

interface TaskState {
  tasks: Task[];
  stats: TaskStats | null;
  selectedTask: Task | null;
  filters: {
    category: string;
    priority: string;
    status: string;
    search: string;
  };
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setStats: (stats: TaskStats) => void;
  setSelectedTask: (task: Task | null) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  togglePin: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleReminder: (id: string) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  stats: null,
  selectedTask: null,
  filters: {
    category: 'all',
    priority: 'all',
    status: 'all',
    search: '',
  },

  setTasks: (tasks) => set({ tasks }),
  
  setStats: (stats) => set({ stats }),
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    ),
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  
  togglePin: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, isPinned: !task.isPinned } : task
    ),
  })),
  
  toggleComplete: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed',
            completedAt: task.status === 'completed' ? null : new Date().toISOString(),
          }
        : task
    ),
  })),
  
  toggleReminder: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, isReminderActive: !task.isReminderActive } : task
    ),
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  clearFilters: () => set({
    filters: {
      category: 'all',
      priority: 'all',
      status: 'all',
      search: '',
    },
  }),
}));
