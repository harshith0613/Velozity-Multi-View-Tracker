import React from 'react';
import { useViewStore } from '../../store/viewStore';
import { useCollaborationStore } from '../../store/collaborationStore';
import { Avatar } from '../ui/Avatar';
import type { ViewType } from '../../types';

const KanbanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="1" y="1" width="4" height="14" rx="1.2" />
    <rect x="6.5" y="1" width="4" height="10" rx="1.2" />
    <rect x="12" y="1" width="3" height="12" rx="1.2" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <line x1="5" y1="4" x2="15" y2="4" />
    <line x1="5" y1="8" x2="15" y2="8" />
    <line x1="5" y1="12" x2="15" y2="12" />
    <circle cx="2" cy="4" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="2" cy="8" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="2" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const TimelineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="1" y="3" width="6" height="3" rx="1" />
    <rect x="5" y="7.5" width="9" height="3" rx="1" />
    <rect x="2" y="12" width="7" height="3" rx="1" />
    <line x1="9" y1="1" x2="9" y2="15" strokeDasharray="2 1.5" strokeWidth="1" />
  </svg>
);

const views: { key: ViewType; label: string; Icon: () => React.ReactElement }[] = [
  { key: 'kanban', label: 'Kanban', Icon: KanbanIcon },
  { key: 'list',   label: 'List',   Icon: ListIcon   },
  { key: 'timeline', label: 'Timeline', Icon: TimelineIcon },
];

export function AppHeader() {
  const currentView = useViewStore((s) => s.currentView);
  const setView     = useViewStore((s) => s.setView);
  const collabUsers = useCollaborationStore((s) => s.users);
  const activeCount = collabUsers.filter((u) => u.activeTaskId !== null).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-surface-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 gap-4">

        {/* ── Logo & Title ── */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
              flex items-center justify-center shadow-md shadow-primary-200/60 shrink-0">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="white">
              <rect x="1" y="1" width="6" height="6" rx="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" opacity="0.75" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" opacity="0.75" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" opacity="0.45" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold text-surface-900 tracking-tight">TaskFlow Pro</h1>
            <p className="text-xs text-surface-400 hidden sm:block">Sprint &amp; Project Management</p>
          </div>
        </div>

        {/* ── View Switcher ── */}
        <nav className="flex items-center bg-surface-100 rounded-xl p-1 gap-1 shrink-0">
          {views.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                transition-all duration-200 cursor-pointer select-none
                ${currentView === key
                  ? 'bg-white text-primary-600 shadow-sm ring-1 ring-surface-200/80'
                  : 'text-surface-500 hover:text-surface-700 hover:bg-white/60'
                }`}
            >
              <Icon />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Live Collaboration Indicator ── */}
        <div className="flex items-center shrink-0">
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
              rounded-full px-4 py-2">
            {/* pulsing dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            {/* stacked avatars */}
            <div className="flex -space-x-1.5">
              {collabUsers.slice(0, 3).map((user) => (
                <Avatar key={user.id} user={user} size="sm" />
              ))}
            </div>
            {/* label */}
            <span className="text-sm font-semibold text-green-700 hidden lg:inline whitespace-nowrap">
              {activeCount} {activeCount === 1 ? 'person' : 'people'} viewing
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
