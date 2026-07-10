import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2 } from 'lucide-react';

interface UndoSendBarProps {
  isVisible: boolean;
  onUndo: () => void;
  onExpire: () => void;
  duration?: number;
}

export function UndoSendBar({
  isVisible,
  onUndo,
  onExpire,
  duration = 5,
}: UndoSendBarProps) {
  const [remaining, setRemaining] = useState(duration);

  const handleUndo = useCallback(() => {
    onUndo();
  }, [onUndo]);

  useEffect(() => {
    if (!isVisible) {
      setRemaining(duration);
      return;
    }

    setRemaining(duration);
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, duration, onExpire]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-4 px-5 py-3 bg-nm-surface/95 backdrop-blur-2xl border border-nm-border rounded-2xl shadow-2xl">
            <span className="text-sm text-nm-text font-medium">
              Sending in {remaining}s…
            </span>

            {/* Progress bar */}
            <div className="w-24 h-1.5 bg-nm-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-nm-accent rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration, ease: 'linear' }}
              />
            </div>

            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-nm-accent/15 hover:bg-nm-accent/25 text-nm-accent rounded-xl text-xs font-semibold transition-colors"
            >
              <Undo2 size={13} />
              Undo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
