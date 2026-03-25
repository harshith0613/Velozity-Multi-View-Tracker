import { STATUS_LABELS } from '../../types';
import type { Task, Status } from '../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: Status;
  tasks:  Task[];
}

const statusConfig: Record<Status, { dot: string; header: string; bg: string; border: string }> = {
  'todo':        { dot: 'bg-indigo-500',  header: 'bg-indigo-50/70',  bg: 'bg-indigo-50/30',  border: 'border-indigo-100' },
  'in-progress': { dot: 'bg-blue-500',    header: 'bg-blue-50/70',    bg: 'bg-blue-50/30',    border: 'border-blue-100'   },
  'in-review':   { dot: 'bg-amber-500',   header: 'bg-amber-50/70',   bg: 'bg-amber-50/30',   border: 'border-amber-100'  },
  'done':        { dot: 'bg-emerald-500', header: 'bg-emerald-50/70', bg: 'bg-emerald-50/30', border: 'border-emerald-100' },
};

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const cfg = statusConfig[status];

  return (
    <div
      data-column-status={status}
      className={`flex flex-col flex-1 min-w-[220px] max-w-xs rounded-xl border ${cfg.border}
        ${cfg.bg} transition-all duration-200`}
    >
      {/* Column Header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl border-b ${cfg.border} ${cfg.header} shrink-0`}>
        <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
        <h3 className="text-xs font-bold text-surface-700 uppercase tracking-wider flex-1">
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-xs font-semibold text-surface-400 bg-white/80 px-2 py-0.5 rounded-full border border-surface-200/60">
          {tasks.length}
        </span>
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-2 overflow-y-auto scrollbar-thin space-y-2 min-h-[80px]">
        {tasks.length === 0 ? (
          /* ── Empty state: properly centred, visibly dark ── */
          <div className="flex flex-col items-center justify-center py-10 select-none text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.4" className="text-surface-400 mb-2.5">
              <rect x="3" y="3" width="18" height="18" rx="3" strokeDasharray="3 2" />
              <line x1="9"  y1="12" x2="15" y2="12" />
              <line x1="12" y1="9"  x2="12" y2="15" />
            </svg>
            <p className="text-sm font-semibold text-surface-600">No tasks here</p>
            <p className="text-xs text-surface-400 mt-0.5">Drop a card to get started</p>
          </div>
        ) : (
          tasks.map((task) => <KanbanCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
