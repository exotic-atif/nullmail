import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nm-accent/20 to-nm-accent-glow/10 flex items-center justify-center mb-5 ring-1 ring-nm-accent/10">
        <div className="text-nm-accent">{icon}</div>
      </div>
      <h3 className="text-lg font-display font-bold text-nm-text mb-2">
        {title}
      </h3>
      <p className="text-sm text-nm-text-tertiary max-w-xs leading-relaxed mb-6">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
