import { useFilterStore } from '../../store/filterStore';
import { MultiSelect } from '../ui/MultiSelect';
import { STATUSES, PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from '../../types';
import type { Status, Priority } from '../../types';
import { getUsers } from '../../data/seed';

const statusOptions   = STATUSES.map((s)  => ({ value: s, label: STATUS_LABELS[s]   }));
const priorityOptions = PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p] }));
const assigneeOptions = getUsers().map((u) => ({ value: u.id, label: u.name         }));

export function FilterBar() {
  const statuses    = useFilterStore((s) => s.statuses);
  const priorities  = useFilterStore((s) => s.priorities);
  const assigneeIds = useFilterStore((s) => s.assigneeIds);
  const dateRange   = useFilterStore((s) => s.dateRange);
  const setStatuses    = useFilterStore((s) => s.setStatuses);
  const setPriorities  = useFilterStore((s) => s.setPriorities);
  const setAssigneeIds = useFilterStore((s) => s.setAssigneeIds);
  const setDateRange   = useFilterStore((s) => s.setDateRange);
  const clearAll    = useFilterStore((s) => s.clearAll);
  const hasActive   = useFilterStore((s) => s.hasActiveFilters);
  const isActive    = hasActive();

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-white border-b border-surface-100">

      {/* Label */}
      <div className="flex items-center gap-2 text-surface-500 shrink-0">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <polygon points="3,2 13,2 9,8 9,13 7,14 7,8" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
      </div>

      <div className="w-px h-5 bg-surface-200 shrink-0" />

      <MultiSelect label="Status"   options={statusOptions}   selected={statuses}    onChange={(v) => setStatuses(v as Status[])}   />
      <MultiSelect label="Priority" options={priorityOptions} selected={priorities}  onChange={(v) => setPriorities(v as Priority[])} />
      <MultiSelect label="Assignee" options={assigneeOptions} selected={assigneeIds} onChange={setAssigneeIds} />

      {/* Date range */}
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="date" value={dateRange.start || ''}
          onChange={(e) => setDateRange(e.target.value || null, dateRange.end)}
          className="px-2.5 py-1.5 rounded-lg border border-surface-200 text-xs text-surface-700
            bg-white hover:border-primary-400 focus:border-primary-400 focus:outline-none
            transition-colors duration-150 cursor-pointer"
        />
        <span className="text-surface-300 text-sm">→</span>
        <input
          type="date" value={dateRange.end || ''}
          onChange={(e) => setDateRange(dateRange.start, e.target.value || null)}
          className="px-2.5 py-1.5 rounded-lg border border-surface-200 text-xs text-surface-700
            bg-white hover:border-primary-400 focus:border-primary-400 focus:outline-none
            transition-colors duration-150 cursor-pointer"
        />
      </div>

      {isActive && (
        <button
          onClick={clearAll}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-red-50 border border-red-100 text-red-500 text-xs font-semibold
            hover:bg-red-100 transition-colors duration-150 cursor-pointer"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="1" y1="1" x2="11" y2="11" />
            <line x1="11" y1="1" x2="1" y2="11" />
          </svg>
          Clear all
        </button>
      )}
    </div>
  );
}
