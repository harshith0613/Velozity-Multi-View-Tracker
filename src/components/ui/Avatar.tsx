interface AvatarProps {
  user: { name: string; avatarColor: string };
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const sizes = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export function Avatar({ user, size = 'md', showTooltip = true, className = '' }: AvatarProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white 
        ring-2 ring-white shrink-0 cursor-default select-none
        transition-transform duration-200 hover:scale-110 hover:z-10
        ${sizes[size]} ${className}`}
      style={{ backgroundColor: user.avatarColor }}
      title={showTooltip ? user.name : undefined}
    >
      {initials}
    </div>
  );
}

interface AvatarGroupProps {
  users: { name: string; avatarColor: string }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar key={i} user={user} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={`inline-flex items-center justify-center rounded-full font-semibold
            bg-surface-200 text-surface-600 ring-2 ring-white shrink-0 ${sizes[size]}`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
