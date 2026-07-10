import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Save, ChevronDown, ChevronUp, Copy, Download, Upload, Type, Hash, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { RecipientInput } from './RecipientInput';
import { SubjectInput } from './SubjectInput';
import { RichTextEditor } from './RichTextEditor';
import { AttachmentZone } from './AttachmentZone';
import { SendingOverlay } from '@/components/sending/SendingOverlay';
import { UndoSendBar } from '@/components/sending/UndoSendBar';
import { Button } from '@/components/ui/Button';
import { useComposerStore } from '@/store/composerStore';
import { useDraftStore } from '@/store/draftStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutosave } from '@/hooks/useAutosave';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { api } from '@/services/api';
import { countWords, countChars, formatBytes, copyToClipboard, stripHtml } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';

export function ComposerPage() {
  const store = useComposerStore();
  const { saveDraft, updateDraft, activeDraftId } = useDraftStore();
  const [showAttachments, setShowAttachments] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const { session } = useAuth();

  // Before unload warning
  useBeforeUnload(store.isDirty);

  // Autosave
  const handleAutosave = useCallback(() => {
    if (!store.isDirty) return;
    const draftData = {
      to: store.to,
      cc: store.cc,
      bcc: store.bcc,
      subject: store.subject,
      html: store.html,
      attachments: store.attachments.map(({ id, name, size, type, progress }) => ({
        id, name, size, type, progress,
      })),
    };
    if (activeDraftId) {
      updateDraft(activeDraftId, draftData);
    } else if (session?.user?.id) {
      saveDraft(draftData, session.user.id);
    }
    store.setDirty(false);
  }, [store, activeDraftId, saveDraft, updateDraft]);

  useAutosave(handleAutosave, store.isDirty);

  // Manual save
  const handleSaveDraft = useCallback(() => {
    handleAutosave();
    toast.success('Draft saved');
  }, [handleAutosave]);

  // Send email
  const handleSend = useCallback(async () => {
    if (store.to.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }
    if (!store.subject.trim()) {
      toast.error('Please add a subject');
      return;
    }

    // Show undo bar
    setUndoVisible(true);
    store.setSendStatus('undoing');
  }, [store]);

  const handleUndoExpire = useCallback(async () => {
    setUndoVisible(false);
    store.setSendStatus('sending');

    const result = await api.sendEmail(
      {
        to: store.to.map((r) => r.email),
        cc: store.cc.map((r) => r.email),
        bcc: store.bcc.map((r) => r.email),
        subject: store.subject,
        html: store.html,
      },
      store.attachments.map((a) => a.file)
    );

    if (result.success) {
      store.setSendStatus('success');
      toast.success('Email sent successfully!');
    } else {
      store.setSendStatus('error');
      toast.error(result.error || 'Failed to send email');
    }
  }, [store]);

  const handleUndo = useCallback(() => {
    setUndoVisible(false);
    store.setSendStatus('idle');
    toast.info('Send cancelled');
  }, [store]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSend: handleSend,
    onSaveDraft: handleSaveDraft,
  });

  // Counters
  const wordCount = countWords(store.html);
  const charCount = countChars(store.html);
  const htmlSize = new Blob([store.html]).size;
  const attachmentSize = store.attachments.reduce((s, a) => s + a.size, 0);

  // Copy / Export handlers
  const handleCopyHtml = () => {
    copyToClipboard(store.html).then((ok) => {
      if (ok) toast.success('HTML copied to clipboard');
    });
  };
  const handleCopyPlainText = () => {
    copyToClipboard(stripHtml(store.html)).then((ok) => {
      if (ok) toast.success('Plain text copied to clipboard');
    });
  };
  const handleExportHtml = () => {
    const blob = new Blob([store.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${store.subject || 'email'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('HTML exported');
  };
  const handleImportHtml = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            store.setHtml(reader.result);
            toast.success('HTML imported');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOver) setIsDraggingOver(true);
  }, [isDraggingOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length) {
      store.addFiles(e.dataTransfer.files);
      setShowAttachments(true);
    }
  }, [store]);

  return (
    <div 
      className="h-full flex flex-col max-w-5xl mx-auto w-full relative"
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {isDraggingOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-nm-bg/80 backdrop-blur-sm border-2 border-dashed border-nm-accent/50 rounded-2xl flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4 text-nm-accent">
              <div className="w-20 h-20 bg-nm-accent/10 rounded-full flex items-center justify-center">
                <Upload size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold">Drop to add attachment(s)</h2>
              <p className="text-sm text-nm-text-tertiary">Files will be added to this email</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-nm-border-subtle"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-xl font-display font-bold text-nm-text tracking-tight">
            Compose Email
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Save size={14} />}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            icon={<Send size={14} />}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 flex flex-col">
        {/* Recipients */}
        <RecipientInput
          label="To"
          recipients={store.to}
          onChange={store.setTo}
        />

        {/* CC/BCC toggle */}
        <div className="flex items-center gap-2 pl-10">
          <button
            onClick={() => store.setShowCc(!store.showCc)}
            className="text-[11px] font-medium text-nm-muted hover:text-nm-accent transition-colors"
          >
            CC
          </button>
          <button
            onClick={() => store.setShowBcc(!store.showBcc)}
            className="text-[11px] font-medium text-nm-muted hover:text-nm-accent transition-colors"
          >
            BCC
          </button>
        </div>

        {store.showCc && (
          <RecipientInput
            label="CC"
            recipients={store.cc}
            onChange={store.setCc}
          />
        )}

        {store.showBcc && (
          <RecipientInput
            label="BCC"
            recipients={store.bcc}
            onChange={store.setBcc}
          />
        )}

        <SubjectInput
          value={store.subject}
          onChange={store.setSubject}
        />

        {/* Editor */}
        <div className="flex-1 min-h-[400px]">
          <RichTextEditor
            content={store.html}
            onChange={store.setHtml}
          />
        </div>

        {/* Attachments */}
        <div>
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className="flex items-center gap-2 text-xs font-medium text-nm-text-tertiary hover:text-nm-text transition-colors mb-2"
          >
            <Paperclip size={13} />
            Attachments
            {store.attachments.length > 0 && (
              <span className="text-nm-accent">({store.attachments.length})</span>
            )}
            {showAttachments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showAttachments && <AttachmentZone />}
        </div>

        {/* Footer bar: counters + actions */}
        <div className="flex items-center justify-between px-1 py-2 border-t border-nm-border-subtle text-[11px] text-nm-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Type size={10} /> {wordCount} words</span>
            <span className="flex items-center gap-1"><Hash size={10} /> {charCount} chars</span>
            <span className="flex items-center gap-1">HTML: {formatBytes(htmlSize)}</span>
            {attachmentSize > 0 && (
              <span className="flex items-center gap-1"><Paperclip size={10} /> {formatBytes(attachmentSize)}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleCopyHtml} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="Copy HTML">
              <Copy size={12} />
            </button>
            <button onClick={handleCopyPlainText} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="Copy Plain Text">
              <Type size={12} />
            </button>
            <button onClick={handleExportHtml} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="Export HTML">
              <Download size={12} />
            </button>
            <button onClick={handleImportHtml} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="Import HTML">
              <Upload size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Sending Overlay */}
      <SendingOverlay />

      {/* Undo Send Bar */}
      <UndoSendBar
        isVisible={undoVisible}
        onUndo={handleUndo}
        onExpire={handleUndoExpire}
      />
    </div>
  );
}
