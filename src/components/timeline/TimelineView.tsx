import { useMemo, useRef } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useFilterStore } from '../../store/filterStore';
import type { Task, Priority } from '../../types';
import { Avatar } from '../ui/Avatar';

const DAY_WIDTH     = 36;
const ROW_HEIGHT    = 44;   // slightly taller so name text has room
const HEADER_HEIGHT = 56;
const LABEL_WIDTH   = 210;
const MIN_LABEL_PX  = 60;   // bar must be at least this wide to show text

// Richer, darker palette so text is legible on pastel bars
const priorityColorMap: Record<Priority, { bar: string; border: string; text: string }> = {
  critical: { bar: '#fecaca', border: '#ef4444', text: '#7f1d1d' },
  high:     { bar: '#fed7aa', border: '#f97316', text: '#7c2d12' },
  medium:   { bar: '#fef08a', border: '#ca8a04', text: '#713f12' },
  low:      { bar: '#bbf7d0', border: '#16a34a', text: '#14532d' },
};

export function TimelineView() {
  const tasks       = useTaskStore((s) => s.tasks);
  const statuses    = useFilterStore((s) => s.statuses);
  const priorities  = useFilterStore((s) => s.priorities);
  const assigneeIds = useFilterStore((s) => s.assigneeIds);
  const dateRange   = useFilterStore((s) => s.dateRange);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    if (statuses.length    > 0 && !statuses.includes(task.status))         return false;
    if (priorities.length  > 0 && !priorities.includes(task.priority))     return false;
    if (assigneeIds.length > 0 && !assigneeIds.includes(task.assignee.id)) return false;
    if (dateRange.start && task.dueDate < dateRange.start) return false;
    if (dateRange.end   && task.dueDate > dateRange.end)   return false;
    return true;
  }), [tasks, statuses, priorities, assigneeIds, dateRange]);

  // Window: 14 days before today → 45 days ahead
  const today = new Date();
  const timelineStart = new Date(today); timelineStart.setDate(timelineStart.getDate() - 14);
  const timelineEnd   = new Date(today); timelineEnd.setDate(timelineEnd.getDate() + 45);

  const days: Date[] = [];
  const cur = new Date(timelineStart);
  while (cur <= timelineEnd) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }

  const totalWidth   = days.length * DAY_WIDTH;
  const todayOffset  = Math.floor((today.getTime() - timelineStart.getTime()) / 86_400_000) * DAY_WIDTH;

  const getBar = (task: Task) => {
    const start = task.startDate
      ? new Date(task.startDate + 'T00:00:00')
      : new Date(task.dueDate  + 'T00:00:00');
    const end = new Date(task.dueDate + 'T00:00:00');
    const startOffset = Math.floor((start.getTime() - timelineStart.getTime()) / 86_400_000);
    const duration    = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1);
    return {
      left: startOffset * DAY_WIDTH,
      width: duration * DAY_WIDTH,
      isSingleDay: !task.startDate || task.startDate === task.dueDate,
    };
  };

  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="flex-1 flex flex-col p-4" id="timeline-view" style={{ minHeight: 0 }}>
      <div className="flex-1 flex rounded-xl border border-surface-200 bg-white overflow-hidden shadow-sm" style={{ minHeight: 0 }}>

        {/* ── Left label panel ── */}
        <div className="shrink-0 border-r border-surface-200 bg-surface-50/80" style={{ width: `${LABEL_WIDTH}px` }}>
          <div className="flex items-end px-3 pb-2 border-b border-surface-200" style={{ height: `${HEADER_HEIGHT}px` }}>
            <span className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">Task</span>
          </div>
          <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {filteredTasks.map((task) => (
              <div key={task.id}
                className="flex items-center gap-2 px-3 border-b border-surface-100 hover:bg-surface-100/60 transition-colors"
                style={{ height: `${ROW_HEIGHT}px` }}>
                <Avatar user={task.assignee} size="sm" />
                <span className="text-xs text-surface-700 truncate flex-1 font-medium">{task.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right timeline panel ── */}
        <div ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin"
          style={{ maxHeight: 'calc(100vh - 224px)' }}>

          <div style={{ width: `${totalWidth}px`, position: 'relative',
            minHeight: `${HEADER_HEIGHT + filteredTasks.length * ROW_HEIGHT}px` }}>

            {/* Date header row */}
            <div className="flex border-b border-surface-200 sticky top-0 bg-white z-10"
              style={{ height: `${HEADER_HEIGHT}px` }}>
              {days.map((day, i) => {
                const isFirstOfMonth = day.getDate() === 1;
                const isToday   = day.toISOString().split('T')[0] === todayStr;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <div key={i}
                    className={`flex flex-col items-center justify-end pb-1.5 border-r border-surface-100
                      ${isWeekend ? 'bg-surface-50/60' : ''} ${isToday ? 'bg-primary-50' : ''}`}
                    style={{ width: `${DAY_WIDTH}px`, minWidth: `${DAY_WIDTH}px` }}>
                    {isFirstOfMonth && (
                      <span className="text-[9px] font-bold text-surface-500 uppercase tracking-wide">
                        {day.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    )}
                    <span className={`text-[10px] font-medium leading-none
                      ${isToday ? 'text-primary-600 font-bold' : 'text-surface-400'}`}>
                      {day.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Today vertical line */}
            <div className="absolute top-0 bottom-0 pointer-events-none z-20"
              style={{ left: `${todayOffset + DAY_WIDTH / 2}px`, width: '2px', background: 'rgba(239,68,68,0.65)' }}>
              <div className="absolute -top-0 -left-1.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
            </div>

            {/* Weekend shading */}
            {days.map((day, i) => (
              (day.getDay() === 0 || day.getDay() === 6) ? (
                <div key={`w-${i}`}
                  className="absolute top-0 bottom-0 bg-surface-50/40 pointer-events-none"
                  style={{ left: `${i * DAY_WIDTH}px`, width: `${DAY_WIDTH}px` }} />
              ) : null
            ))}

            {/* Task bars */}
            {filteredTasks.map((task, rowIdx) => {
              const { left, width, isSingleDay } = getBar(task);
              const colors    = priorityColorMap[task.priority];
              const barH      = ROW_HEIGHT - 12;
              const barTop    = HEADER_HEIGHT + rowIdx * ROW_HEIGHT + 6;
              const firstName = task.assignee.name.split(' ')[0];
              const showLabel = !isSingleDay && width >= MIN_LABEL_PX;

              return (
                <div key={task.id} className="absolute flex items-center"
                  style={{ top: `${barTop}px`, left: `${left}px`, height: `${barH}px` }}>

                  {isSingleDay ? (
                    /* Diamond marker for single-day tasks */
                    <div title={`${task.title} — ${task.assignee.name}`}
                      className="flex items-center justify-center"
                      style={{ width: `${DAY_WIDTH}px`, height: `${barH}px` }}>
                      <div className="w-3.5 h-3.5 rotate-45 border-2 shadow-sm"
                        style={{ backgroundColor: colors.bar, borderColor: colors.border }} />
                    </div>
                  ) : (
                    /* Multi-day bar WITH assignee first-name inside */
                    <div
                      title={`${task.title} — ${task.assignee.name}`}
                      className="h-full rounded-md shadow-sm hover:shadow-md transition-shadow
                        cursor-pointer relative overflow-hidden group flex items-center"
                      style={{
                        width: `${Math.max(width, DAY_WIDTH)}px`,
                        backgroundColor: colors.bar,
                        borderLeft: `3px solid ${colors.border}`,
                      }}
                    >
                      {/* subtle hover darkening */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />

                      {/* Assignee name — only if bar is wide enough */}
                      {showLabel && (
                        <span
                          className="relative z-10 px-2 text-[11px] font-semibold truncate leading-none select-none"
                          style={{ color: colors.text, maxWidth: `${width - 10}px` }}
                        >
                          {firstName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Row separators */}
            {filteredTasks.map((_, i) => (
              <div key={`g-${i}`}
                className="absolute left-0 border-b border-surface-100/70 pointer-events-none"
                style={{ top: `${HEADER_HEIGHT + i * ROW_HEIGHT}px`, width: `${totalWidth}px` }} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-surface-400 mt-2 px-1">
        Showing {filteredTasks.length} tasks ·{' '}
        {timelineStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
        {timelineEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
    </div>
  );
}
