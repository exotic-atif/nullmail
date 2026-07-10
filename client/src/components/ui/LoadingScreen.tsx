import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-nm-black flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated logo */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nm-accent to-nm-accent-glow flex items-center justify-center shadow-2xl shadow-nm-accent/30"
        >
          <Mail size={28} className="text-white" />
        </motion.div>

        {/* Brand */}
        <div className="text-center">
          <h1 className="font-display text-xl font-bold text-nm-text tracking-tight">
            NullMail
          </h1>
          <p className="text-xs text-nm-text-tertiary mt-1">
            Loading your workspace…
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-32 h-1 bg-nm-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-nm-accent to-nm-accent-glow rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
