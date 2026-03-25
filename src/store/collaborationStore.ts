import { create } from 'zustand';
import type { CollaborationUser } from '../types';

interface CollaborationStore {
  users: CollaborationUser[];
  setUsers: (users: CollaborationUser[]) => void;
  moveUser: (userId: string, taskId: string | null) => void;
  getUsersOnTask: (taskId: string) => CollaborationUser[];
}

export const useCollaborationStore = create<CollaborationStore>((set, get) => ({
  users: [],

  setUsers: (users) => set({ users }),

  moveUser: (userId, taskId) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, activeTaskId: taskId } : u
      ),
    }));
  },

  getUsersOnTask: (taskId) => {
    return get().users.filter((u) => u.activeTaskId === taskId);
  },
}));
