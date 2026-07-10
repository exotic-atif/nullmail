import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

const variants = {
  primary:
    'bg-nm-accent hover:bg-nm-accent-hover text-white glow-accent shadow-lg shadow-nm-accent/20',
  secondary:
    'bg-white/5 hover:bg-white/10 text-nm-text border border-nm-border-subtle',
  ghost:
    'hover:bg-white/5 text-nm-text-secondary hover:text-nm-text',
  danger:
    'bg-nm-danger/10 hover:bg-nm-danger/20 text-nm-danger border border-nm-danger/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-sm rounded-2xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
}
