import { X } from 'lucide-react';
import { cn, getInitials, stringToGradient } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'accent';
}

export function Chip({ label, onRemove, variant = 'default' }: ChipProps) {
  const initials = getInitials(label);
  const gradient = stringToGradient(label);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
      className={cn(
        'inline-flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full text-xs font-medium',
        'transition-colors duration-200',
        variant === 'default'
          ? 'bg-white/5 border border-nm-border-subtle text-nm-text-secondary hover:bg-white/10'
          : 'bg-nm-accent-dim border border-nm-accent/20 text-nm-accent'
      )}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
        style={{ background: gradient }}
      >
        {initials}
      </div>
      <span className="truncate max-w-[160px]">{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-nm-muted hover:text-nm-text transition-colors rounded-full hover:bg-white/10 p-0.5"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
}
