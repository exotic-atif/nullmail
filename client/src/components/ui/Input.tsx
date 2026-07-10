import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-nm-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nm-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-nm-surface/50 border border-nm-border-subtle rounded-xl px-4 py-2.5 text-sm text-nm-text',
              'placeholder:text-nm-muted',
              'focus:outline-none focus:border-nm-accent/50 focus:ring-1 focus:ring-nm-accent/20',
              'transition-all duration-200',
              icon && 'pl-10',
              error && 'border-nm-danger/50 focus:border-nm-danger focus:ring-nm-danger/20',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-nm-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
