import { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Paperclip } from 'lucide-react';
import { useComposerStore } from '@/store/composerStore';
import { formatBytes, getFileIcon } from '@/lib/utils';

export function AttachmentZone() {
  const attachments = useComposerStore((s) => s.attachments);
  const removeAttachment = useComposerStore((s) => s.removeAttachment);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSize = attachments.reduce((sum, a) => sum + a.size, 0);
  const MAX_SIZE = 25 * 1024 * 1024;

  const addFiles = useComposerStore((s) => s.addFiles);
  
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      addFiles(files);
    },
    [addFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item?.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length) handleFiles(files);
    },
    [handleFiles]
  );

  return (
    <div onPaste={handlePaste}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-nm-border hover:border-nm-accent/30 rounded-xl p-4 cursor-pointer transition-colors group"
      >
        <div className="flex items-center justify-center gap-2 text-nm-text-tertiary group-hover:text-nm-accent transition-colors">
          <Upload size={16} />
          <span className="text-xs font-medium">
            Drop files here or click to browse
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Attachment list */}
      {attachments.length > 0 && (
        <div className="mt-3 space-y-2">
          <AnimatePresence>
            {attachments.map((att) => (
              <motion.div
                key={att.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-3 py-2 bg-nm-surface/30 border border-nm-border-subtle rounded-xl"
              >
                {att.preview ? (
                  <img
                    src={att.preview}
                    alt={att.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <span className="text-lg shrink-0">{getFileIcon(att.type)}</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-nm-text truncate">{att.name}</p>
                  <p className="text-[10px] text-nm-text-tertiary">
                    {formatBytes(att.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="text-nm-muted hover:text-nm-danger transition-colors p-1 rounded-lg hover:bg-nm-danger/10"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Size indicator */}
          <div className="flex items-center gap-2 px-1">
            <Paperclip size={12} className="text-nm-muted" />
            <span className="text-[10px] text-nm-text-tertiary">
              {attachments.length} file{attachments.length !== 1 ? 's' : ''} · {formatBytes(totalSize)} / {formatBytes(MAX_SIZE)}
            </span>
            <div className="flex-1 h-1 bg-nm-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-nm-accent rounded-full transition-all"
                style={{ width: `${Math.min((totalSize / MAX_SIZE) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
