import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  return (
    <div className="relative group/tooltip inline-flex">
      {children}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none',
          'opacity-0 group-hover/tooltip:opacity-100',
          'transition-opacity duration-200 delay-300',
          position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        )}
      >
        <div className="bg-nm-elevated border border-nm-border rounded-lg px-2.5 py-1.5 text-[11px] text-nm-text-secondary font-medium whitespace-nowrap shadow-xl">
          {content}
        </div>
      </div>
    </div>
  );
}
