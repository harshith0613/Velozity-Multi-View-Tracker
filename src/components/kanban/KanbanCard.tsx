import { PRIORITY_LABELS } from '../../types';
import type { Task } from '../../types';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useCollaborationStore } from '../../store/collaborationStore';

interface KanbanCardProps {
  task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
  const users = useCollaborationStore((s) => s.users);
  const collabUsers = users.filter((u) => u.activeTaskId === task.id);

  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];
  const dueDateObj = new Date(task.dueDate + 'T00:00:00');
  const isOverdue = task.dueDate < today && task.status !== 'done';
  const isDueToday = task.dueDate === today;
  const daysOverdue = isOverdue
    ? Math.floor((todayDate.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formattedDueDate = dueDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  let dueDateLabel: string;
  let dueDateClass: string;
  if (isOverdue && daysOverdue > 7) {
    dueDateLabel = `${daysOverdue}d overdue`;
    dueDateClass = 'bg-red-100 text-red-600 border border-red-200';
  } else if (isOverdue) {
    dueDateLabel = formattedDueDate;
    dueDateClass = 'bg-red-50 text-red-500 border border-red-100';
  } else if (isDueToday) {
    dueDateLabel = 'Due today';
    dueDateClass = 'bg-amber-50 text-amber-600 border border-amber-200';
  } else {
    dueDateLabel = formattedDueDate;
    dueDateClass = 'text-surface-400';
  }

  return (
    <div
      data-task-id={task.id}
      data-task-status={task.status}
      className="bg-white rounded-lg p-3 border border-surface-200 cursor-grab
        hover:shadow-md hover:border-surface-300 hover:-translate-y-0.5
        active:cursor-grabbing active:shadow-lg
        transition-all duration-150 select-none group"
    >
      {/* Top row: Priority badge + collab avatars */}
      <div className="flex items-center justify-between mb-2 gap-1">
        <Badge variant="priority" value={task.priority}>
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        {collabUsers.length > 0 && (
          <AvatarGroup users={collabUsers} max={2} size="sm" />
        )}
      </div>

      {/* Title */}
      <h4 className="text-xs font-semibold text-surface-800 mb-2.5 line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Bottom row: Assignee + due date */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar user={task.assignee} size="sm" />
          <span className="text-[11px] text-surface-400 truncate">
            {task.assignee.name.split(' ')[0]}
          </span>
        </div>
        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${dueDateClass}`}>
          {isOverdue && <span className="mr-0.5">⚑</span>}
          {dueDateLabel}
        </span>
      </div>
    </div>
  );
}
