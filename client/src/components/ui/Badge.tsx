import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'warning' | 'purple';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-white/5 text-nm-text-secondary border-nm-border-subtle',
  accent: 'bg-nm-accent-dim text-nm-accent border-nm-accent/20',
  success: 'bg-nm-success-dim text-nm-success border-nm-success/20',
  danger: 'bg-nm-danger-dim text-nm-danger border-nm-danger/20',
  warning: 'bg-nm-warning-dim text-nm-warning border-nm-warning/20',
  purple: 'bg-nm-purple-dim text-nm-purple border-nm-purple/20',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold border rounded-full',
        variantStyles[variant],
        size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-wider' : 'px-3 py-1 text-xs'
      )}
    >
      {children}
    </span>
  );
}
