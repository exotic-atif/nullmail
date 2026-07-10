import { create } from 'zustand';
import type { EmailRecipient, EmailAttachment, SendStatus, PreviewMode } from '@/types';

interface ComposerStore {
  to: EmailRecipient[];
  cc: EmailRecipient[];
  bcc: EmailRecipient[];
  showCc: boolean;
  showBcc: boolean;
  subject: string;
  html: string;
  attachments: EmailAttachment[];
  previewMode: PreviewMode;
  sendStatus: SendStatus;
  templateId: string | null;
  isDirty: boolean;

  setTo: (to: EmailRecipient[]) => void;
  setCc: (cc: EmailRecipient[]) => void;
  setBcc: (bcc: EmailRecipient[]) => void;
  setShowCc: (show: boolean) => void;
  setShowBcc: (show: boolean) => void;
  setSubject: (subject: string) => void;
  setHtml: (html: string) => void;
  addAttachment: (attachment: EmailAttachment) => void;
  removeAttachment: (id: string) => void;
  updateAttachmentProgress: (id: string, progress: number) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setSendStatus: (status: SendStatus) => void;
  setTemplateId: (id: string | null) => void;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
}

const initialState = {
  to: [] as EmailRecipient[],
  cc: [] as EmailRecipient[],
  bcc: [] as EmailRecipient[],
  showCc: false,
  showBcc: false,
  subject: '',
  html: '',
  attachments: [] as EmailAttachment[],
  previewMode: 'desktop' as PreviewMode,
  sendStatus: 'idle' as SendStatus,
  templateId: null as string | null,
  isDirty: false,
};

export const useComposerStore = create<ComposerStore>()((set) => ({
  ...initialState,

  setTo: (to) => set({ to, isDirty: true }),
  setCc: (cc) => set({ cc, isDirty: true }),
  setBcc: (bcc) => set({ bcc, isDirty: true }),
  setShowCc: (showCc) => set({ showCc }),
  setShowBcc: (showBcc) => set({ showBcc }),
  setSubject: (subject) => set({ subject, isDirty: true }),
  setHtml: (html) => set({ html, isDirty: true }),

  addAttachment: (attachment) =>
    set((state) => ({
      attachments: [...state.attachments, attachment],
      isDirty: true,
    })),

  removeAttachment: (id) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a.id !== id),
      isDirty: true,
    })),

  updateAttachmentProgress: (id, progress) =>
    set((state) => ({
      attachments: state.attachments.map((a) =>
        a.id === id ? { ...a, progress } : a
      ),
    })),

  setPreviewMode: (previewMode) => set({ previewMode }),
  setSendStatus: (sendStatus) => set({ sendStatus }),
  setTemplateId: (templateId) => set({ templateId }),
  setDirty: (isDirty) => set({ isDirty }),

  reset: () => set(initialState),
}));
