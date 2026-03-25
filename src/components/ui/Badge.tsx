import type { Priority, Status } from '../../types';

interface BadgeProps {
  variant: 'priority' | 'status';
  value: Priority | Status;
  children: React.ReactNode;
  className?: string;
}

const priorityDot: Record<Priority, string> = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  medium:   'bg-yellow-500',
  low:      'bg-green-500',
};

const priorityStyles: Record<Priority, string> = {
  critical: 'bg-red-50 text-red-700 border-red-200',
  high:     'bg-orange-50 text-orange-700 border-orange-200',
  medium:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  low:      'bg-green-50 text-green-700 border-green-200',
};

const statusStyles: Record<Status, string> = {
  'todo':        'bg-indigo-50 text-indigo-700 border-indigo-200',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'in-review':   'bg-amber-50 text-amber-700 border-amber-200',
  'done':        'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function Badge({ variant, value, children, className = '' }: BadgeProps) {
  const styles = variant === 'priority'
    ? priorityStyles[value as Priority]
    : statusStyles[value as Status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold
        border ${styles} ${className}`}
    >
      {variant === 'priority' && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[value as Priority]}`} />
      )}
      {children}
    </span>
  );
}
