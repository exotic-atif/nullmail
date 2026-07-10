import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Clock } from 'lucide-react';
import { useDraftStore } from '@/store/draftStore';
import { useComposerStore } from '@/store/composerStore';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { truncate } from '@/lib/utils';
import { toast } from 'sonner';

export function DraftsPage() {
  const { drafts, deleteDraft, setActiveDraftId } = useDraftStore();
  const composerStore = useComposerStore();
  const navigate = useNavigate();

  const restoreDraft = (draft: typeof drafts[0]) => {
    composerStore.setTo(draft.to);
    composerStore.setCc(draft.cc);
    composerStore.setBcc(draft.bcc);
    composerStore.setSubject(draft.subject);
    composerStore.setHtml(draft.html);
    setActiveDraftId(draft.id);
    composerStore.setDirty(false);
    toast.success('Draft restored');
    navigate('/');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-nm-text tracking-tight">
          Drafts
        </h1>
        <p className="text-sm text-nm-text-tertiary mt-1">
          {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved
        </p>
      </motion.div>

      {drafts.length === 0 ? (
        <EmptyState
          icon={<FileText size={24} />}
          title="No drafts yet"
          description="Drafts are automatically saved every 5 seconds while composing"
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {drafts.map((draft, i) => (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => restoreDraft(draft)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-nm-surface/30 border border-nm-border-subtle hover:border-nm-accent/20 cursor-pointer transition-all group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-nm-accent-dim flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-nm-accent" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-nm-text truncate">
                    {draft.subject || 'No subject'}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-nm-text-tertiary truncate">
                      To: {draft.to.length > 0
                        ? truncate(draft.to.map((r) => r.name || r.email).join(', '), 40)
                        : 'No recipients'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-nm-muted shrink-0">
                      <Clock size={10} />
                      {formatDate(draft.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDraft(draft.id);
                    toast.success('Draft deleted');
                  }}
                  className="p-2 text-nm-muted hover:text-nm-danger rounded-lg hover:bg-nm-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
