import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle, X } from 'lucide-react';
import { useComposerStore } from '@/store/composerStore';
import { Button } from '@/components/ui/Button';

export function SendingOverlay() {
  const status = useComposerStore((s) => s.sendStatus);
  const setSendStatus = useComposerStore((s) => s.setSendStatus);

  if (status === 'idle' || status === 'undoing') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-nm-black/80 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="flex flex-col items-center gap-6 text-center max-w-sm"
        >
          {/* Sending state */}
          {status === 'sending' && (
            <>
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-nm-accent to-nm-accent-glow flex items-center justify-center shadow-2xl shadow-nm-accent/30"
              >
                <Send size={32} className="text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-display font-bold text-nm-text mb-2">
                  Sending your email…
                </h3>
                <p className="text-sm text-nm-text-tertiary">
                  Please wait while we deliver your message
                </p>
              </div>
              {/* Progress ring */}
              <div className="w-8 h-8 border-2 border-nm-accent border-t-transparent rounded-full animate-spin" />
            </>
          )}

          {/* Success state */}
          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="w-20 h-20 rounded-3xl bg-nm-success/20 flex items-center justify-center ring-2 ring-nm-success/30"
              >
                <Check size={32} className="text-nm-success" />
              </motion.div>
              <div>
                <h3 className="text-xl font-display font-bold text-nm-text mb-2">
                  Email sent!
                </h3>
                <p className="text-sm text-nm-text-tertiary">
                  Your message has been delivered successfully
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setSendStatus('idle')}
                icon={<X size={16} />}
              >
                Close
              </Button>
            </>
          )}

          {/* Error state */}
          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="w-20 h-20 rounded-3xl bg-nm-danger/20 flex items-center justify-center ring-2 ring-nm-danger/30"
              >
                <AlertCircle size={32} className="text-nm-danger" />
              </motion.div>
              <div>
                <h3 className="text-xl font-display font-bold text-nm-text mb-2">
                  Failed to send
                </h3>
                <p className="text-sm text-nm-text-tertiary">
                  Something went wrong. Please check your settings and try again.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setSendStatus('idle')}
                >
                  Dismiss
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setSendStatus('idle')}
                >
                  Retry
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
