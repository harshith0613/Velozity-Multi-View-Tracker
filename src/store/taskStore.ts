import { create } from 'zustand';
import type { Task, Status } from '../types';
import { generateTasks } from '../data/seed';

interface TaskStore {
  tasks: Task[];
  updateTaskStatus: (taskId: string, newStatus: Status) => void;
  getTasksByStatus: (status: Status) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: generateTasks(500),

  updateTaskStatus: (taskId: string, newStatus: Status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));
  },

  getTasksByStatus: (status: Status) => {
    return get().tasks.filter((task) => task.status === status);
  },
}));
