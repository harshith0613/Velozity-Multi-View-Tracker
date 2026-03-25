import { create } from 'zustand';
import type { ViewType, SortConfig } from '../types';

interface ViewStore {
  currentView: ViewType;
  sortConfig: SortConfig;
  setView: (view: ViewType) => void;
  setSortConfig: (config: SortConfig) => void;
  toggleSort: (field: SortConfig['field']) => void;
}

export const useViewStore = create<ViewStore>((set, get) => ({
  currentView: 'kanban',
  sortConfig: { field: 'createdAt', direction: 'desc' },

  setView: (view) => set({ currentView: view }),

  setSortConfig: (config) => set({ sortConfig: config }),

  toggleSort: (field) => {
    const current = get().sortConfig;
    if (current.field === field) {
      set({
        sortConfig: {
          field,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        },
      });
    } else {
      set({ sortConfig: { field, direction: 'asc' } });
    }
  },
}));
