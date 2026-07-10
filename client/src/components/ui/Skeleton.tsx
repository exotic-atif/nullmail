import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-nm-surface/60 rounded-lg animate-pulse',
        className
      )}
    />
  );
}
