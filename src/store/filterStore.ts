import { create } from 'zustand';
import type { FilterState, Status, Priority } from '../types';

interface FilterStore extends FilterState {
  setStatuses: (statuses: Status[]) => void;
  setPriorities: (priorities: Priority[]) => void;
  setAssigneeIds: (ids: string[]) => void;
  setDateRange: (start: string | null, end: string | null) => void;
  clearAll: () => void;
  hasActiveFilters: () => boolean;
  initFromUrl: () => void;
  syncToUrl: () => void;
}

const EMPTY_FILTERS: FilterState = {
  statuses: [],
  priorities: [],
  assigneeIds: [],
  dateRange: { start: null, end: null },
};

function parseFiltersFromUrl(): Partial<FilterState> {
  const params = new URLSearchParams(window.location.search);
  const result: Partial<FilterState> = {};

  const statuses = params.get('statuses');
  if (statuses) result.statuses = statuses.split(',') as Status[];

  const priorities = params.get('priorities');
  if (priorities) result.priorities = priorities.split(',') as Priority[];

  const assignees = params.get('assignees');
  if (assignees) result.assigneeIds = assignees.split(',');

  const dateStart = params.get('dateStart');
  const dateEnd = params.get('dateEnd');
  if (dateStart || dateEnd) {
    result.dateRange = { start: dateStart || null, end: dateEnd || null };
  }

  return result;
}

function filtersToUrlParams(state: FilterState): string {
  const params = new URLSearchParams();

  if (state.statuses.length) params.set('statuses', state.statuses.join(','));
  if (state.priorities.length) params.set('priorities', state.priorities.join(','));
  if (state.assigneeIds.length) params.set('assignees', state.assigneeIds.join(','));
  if (state.dateRange.start) params.set('dateStart', state.dateRange.start);
  if (state.dateRange.end) params.set('dateEnd', state.dateRange.end);

  return params.toString();
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...EMPTY_FILTERS,

  setStatuses: (statuses) => {
    set({ statuses });
    get().syncToUrl();
  },

  setPriorities: (priorities) => {
    set({ priorities });
    get().syncToUrl();
  },

  setAssigneeIds: (ids) => {
    set({ assigneeIds: ids });
    get().syncToUrl();
  },

  setDateRange: (start, end) => {
    set({ dateRange: { start, end } });
    get().syncToUrl();
  },

  clearAll: () => {
    set(EMPTY_FILTERS);
    get().syncToUrl();
  },

  hasActiveFilters: () => {
    const state = get();
    return (
      state.statuses.length > 0 ||
      state.priorities.length > 0 ||
      state.assigneeIds.length > 0 ||
      state.dateRange.start !== null ||
      state.dateRange.end !== null
    );
  },

  initFromUrl: () => {
    const parsed = parseFiltersFromUrl();
    set({ ...EMPTY_FILTERS, ...parsed });
  },

  syncToUrl: () => {
    const state = get();
    const query = filtersToUrlParams(state);
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  },
}));
