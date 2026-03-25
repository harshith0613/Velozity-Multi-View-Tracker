import { useMemo, useState, useRef, useCallback } from 'react';
import { useTaskStore }   from '../../store/taskStore';
import { useFilterStore } from '../../store/filterStore';
import { useViewStore }   from '../../store/viewStore';
import { STATUS_LABELS, PRIORITY_LABELS, STATUSES } from '../../types';
import type { SortField, Status } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge }  from '../ui/Badge';

// ── Virtual scroll constants ────────────────────────────────────────────────
const ROW_HEIGHT = 40;   // down from 52 — compact but readable
const BUFFER     = 10;

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

// Shared column grid — header and rows MUST match exactly
const COL_GRID = 'grid-cols-[1fr_108px_86px_108px_86px_76px]';

// Sort icons
const AscIcon  = () => <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="2,7 5,3 8,7" /></svg>;
const DescIcon = () => <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="2,3 5,7 8,3" /></svg>;
const NeutralSortIcon = () => (
  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-25">
    <polyline points="2,4 5,1 8,4" />
    <polyline points="2,6 5,9 8,6" />
  </svg>
);

export function ListView() {
  const tasks            = useTaskStore((s) => s.tasks);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const statuses         = useFilterStore((s) => s.statuses);
  const priorities       = useFilterStore((s) => s.priorities);
  const assigneeIds      = useFilterStore((s) => s.assigneeIds);
  const dateRange        = useFilterStore((s) => s.dateRange);
  const sortConfig       = useViewStore((s) => s.sortConfig);
  const toggleSort       = useViewStore((s) => s.toggleSort);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    const result = tasks.filter((t) => {
      if (statuses.length    > 0 && !statuses.includes(t.status))         return false;
      if (priorities.length  > 0 && !priorities.includes(t.priority))     return false;
      if (assigneeIds.length > 0 && !assigneeIds.includes(t.assignee.id)) return false;
      if (dateRange.start && t.dueDate < dateRange.start) return false;
      if (dateRange.end   && t.dueDate > dateRange.end)   return false;
      return true;
    });

    result.sort((a, b) => {
      const { field, direction } = sortConfig;
      let cmp = 0;
      if (field === 'title')     cmp = a.title.localeCompare(b.title);
      if (field === 'priority')  cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (field === 'dueDate')   cmp = a.dueDate.localeCompare(b.dueDate);
      if (field === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
      return direction === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [tasks, statuses, priorities, assigneeIds, dateRange, sortConfig]);

  // ── Virtual scroll maths ──────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  const containerHeight = containerRef.current?.clientHeight || 600;
  const totalHeight     = filteredAndSorted.length * ROW_HEIGHT;
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIdx   = Math.min(filteredAndSorted.length,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER);
  const visibleTasks = filteredAndSorted.slice(startIdx, endIdx);

  const today = new Date().toISOString().split('T')[0];

  // ── Sortable column header ─────────────────────────────────────────────────
  const SortHeader = ({ field, label }: { field: SortField; label: string }) => {
    const active = sortConfig.field === field;
    return (
      <button
        onClick={() => toggleSort(field)}
        className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider
          transition-colors cursor-pointer select-none
          ${active ? 'text-primary-600' : 'text-surface-400 hover:text-surface-600'}`}
      >
        {label}
        <span>{active ? (sortConfig.direction === 'asc' ? <AscIcon /> : <DescIcon />) : <NeutralSortIcon />}</span>
      </button>
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-3" id="list-view" style={{ minHeight: 0 }}>

      {/* ── Table Header ────────────────────────────────────────────────── */}
      <div className={`grid ${COL_GRID} gap-3 px-4 py-2
          bg-surface-50 rounded-t-xl border border-surface-200 shrink-0`}>
        <SortHeader field="title"     label="Task"    />
        <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400">Assignee</span>
        <SortHeader field="priority"  label="Priority" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400">Status</span>
        <SortHeader field="dueDate"   label="Due"      />
        <SortHeader field="createdAt" label="Created"  />
      </div>

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12
            bg-white border border-t-0 border-surface-200 rounded-b-xl flex-1">
          <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" className="text-surface-400">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-surface-800 mb-1">No tasks found</h3>
          <p className="text-sm text-surface-400 mb-5 text-center max-w-xs">
            No tasks match your current filters. Try adjusting or clearing them.
          </p>
          <button
            onClick={() => useFilterStore.getState().clearAll()}
            className="px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg
              hover:bg-primary-600 transition-colors cursor-pointer shadow-sm"
          >
            Clear filters
          </button>
        </div>

      ) : (
        /* ── Virtual scroll container ───────────────────────────────────── */
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto border-x border-b border-surface-200 rounded-b-xl bg-white scrollbar-thin"
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            {visibleTasks.map((task, i) => {
              const idx        = startIdx + i;
              const dueDateObj = new Date(task.dueDate + 'T00:00:00');
              const isOverdue  = task.dueDate < today && task.status !== 'done';
              const isDueToday = task.dueDate === today;
              const daysOverdue = isOverdue
                ? Math.floor((Date.now() - dueDateObj.getTime()) / 86_400_000)
                : 0;
              const dueDateStr = dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const dueDateDisplay =
                isOverdue && daysOverdue > 7 ? `${daysOverdue}d overdue`
                : isOverdue                  ? dueDateStr
                : isDueToday                 ? 'Due today'
                :                              dueDateStr;

              return (
                <div
                  key={task.id}
                  className={`grid ${COL_GRID} gap-3 items-center px-4
                    border-b border-surface-100 hover:bg-surface-50/70
                    transition-colors duration-100`}
                  style={{
                    position: 'absolute',
                    top: `${idx * ROW_HEIGHT}px`,
                    height: `${ROW_HEIGHT}px`,
                    width: '100%',
                  }}
                >
                  {/* Title */}
                  <span className="text-xs font-semibold text-surface-800 truncate leading-tight">
                    {task.title}
                  </span>

                  {/* Assignee */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Avatar user={task.assignee} size="sm" />
                    <span className="text-xs text-surface-500 truncate">
                      {task.assignee.name.split(' ')[0]}
                    </span>
                  </div>

                  {/* Priority badge */}
                  <Badge variant="priority" value={task.priority}>
                    {PRIORITY_LABELS[task.priority]}
                  </Badge>

                  {/* Inline status dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                    className="text-xs px-1.5 py-0.5 rounded border border-surface-200 w-full
                      bg-white text-surface-700 cursor-pointer hover:border-primary-300
                      transition-colors duration-150 outline-none focus:border-primary-400"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>

                  {/* Due date */}
                  <span className={`text-xs font-medium truncate
                    ${isOverdue ? 'text-red-600' : isDueToday ? 'text-amber-600' : 'text-surface-400'}`}>
                    {isOverdue && <span className="mr-0.5">⚑</span>}
                    {dueDateDisplay}
                  </span>

                  {/* Created */}
                  <span className="text-xs text-surface-400 truncate">
                    {new Date(task.createdAt + 'T00:00:00')
                      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-surface-400 mt-1.5 px-1">
        <span>{filteredAndSorted.length} tasks</span>
        {filteredAndSorted.length > 0 && (
          <span className="text-surface-300">{visibleTasks.length} rows rendered · virtual scroll</span>
        )}
      </div>
    </div>
  );
}
