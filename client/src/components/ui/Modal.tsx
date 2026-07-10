import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`relative w-full ${maxWidth} bg-nm-surface/95 backdrop-blur-2xl border border-white/10 rounded-[28px] p-6 shadow-2xl overflow-hidden`}
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-nm-accent/15 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-nm-accent-glow/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-display font-bold text-nm-text">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-nm-text-tertiary hover:text-nm-text p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
