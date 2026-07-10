import { create } from 'zustand';
import type { EmailDraft } from '@/types';
import { generateId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface DraftStore {
  drafts: EmailDraft[];
  activeDraftId: string | null;

  fetchDrafts: (userId: string) => Promise<void>;
  saveDraft: (draft: Omit<EmailDraft, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => Promise<string>;
  updateDraft: (id: string, updates: Partial<EmailDraft>) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  getDraft: (id: string) => EmailDraft | undefined;
  setActiveDraftId: (id: string | null) => void;
}

export const useDraftStore = create<DraftStore>()((set, get) => ({
  drafts: [],
  activeDraftId: null,

  fetchDrafts: async (userId: string) => {
    const { data, error } = await supabase
      .from('nm_drafts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      const drafts: EmailDraft[] = data.map((d: any) => ({
        id: d.id,
        to: d.to_recipients || [],
        cc: d.cc_recipients || [],
        bcc: d.bcc_recipients || [],
        subject: d.subject || '',
        html: d.html || '',
        attachments: d.attachments || [],
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
      set({ drafts });
    }
  },

  saveDraft: async (draft, userId) => {
    const id = generateId();
    const now = new Date().toISOString();
    
    const newDraft: EmailDraft = { ...draft, id, createdAt: now, updatedAt: now };

    // Optimistic update
    set((state) => ({
      drafts: [newDraft, ...state.drafts],
      activeDraftId: id,
    }));

    await supabase.from('nm_drafts').insert({
      id,
      user_id: userId,
      to_recipients: draft.to,
      cc_recipients: draft.cc,
      bcc_recipients: draft.bcc,
      subject: draft.subject,
      html: draft.html,
      attachments: draft.attachments,
      created_at: now,
      updated_at: now,
    });

    return id;
  },

  updateDraft: async (id, updates) => {
    const now = new Date().toISOString();

    // Optimistic update
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: now } : d
      ),
    }));

    const updateData: any = { updated_at: now };
    if (updates.to) updateData.to_recipients = updates.to;
    if (updates.cc) updateData.cc_recipients = updates.cc;
    if (updates.bcc) updateData.bcc_recipients = updates.bcc;
    if (updates.subject !== undefined) updateData.subject = updates.subject;
    if (updates.html !== undefined) updateData.html = updates.html;
    if (updates.attachments !== undefined) updateData.attachments = updates.attachments;

    await supabase.from('nm_drafts').update(updateData).eq('id', id);
  },

  deleteDraft: async (id) => {
    // Optimistic update
    set((state) => ({
      drafts: state.drafts.filter((d) => d.id !== id),
      activeDraftId: state.activeDraftId === id ? null : state.activeDraftId,
    }));

    await supabase.from('nm_drafts').delete().eq('id', id);
  },

  getDraft: (id) => get().drafts.find((d) => d.id === id),
  setActiveDraftId: (activeDraftId) => set({ activeDraftId }),
}));
