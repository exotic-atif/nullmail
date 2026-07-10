import { create } from 'zustand';
import type { Contact, ContactGroup } from '@/types';
import { generateId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface ContactStore {
  contacts: Contact[];
  groups: ContactGroup[];
  searchQuery: string;

  fetchData: (userId: string) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'isFavorite'>, userId: string) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  markUsed: (email: string) => Promise<void>;

  addGroup: (name: string, color: string, userId: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;

  setSearchQuery: (query: string) => void;
  getFilteredContacts: () => Contact[];
  getRecentContacts: (limit?: number) => Contact[];
  getFavorites: () => Contact[];
}

export const useContactStore = create<ContactStore>()((set, get) => ({
  contacts: [],
  groups: [],
  searchQuery: '',

  fetchData: async (userId: string) => {
    const [contactsRes, groupsRes] = await Promise.all([
      supabase.from('nm_contacts').select('*').eq('user_id', userId),
      supabase.from('nm_contact_groups').select('*').eq('user_id', userId)
    ]);

    if (!contactsRes.error && contactsRes.data) {
      set({
        contacts: contactsRes.data.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          group: c.group_id,
          isFavorite: c.is_favorite,
          lastUsed: c.last_used,
          createdAt: c.created_at,
        }))
      });
    }

    if (!groupsRes.error && groupsRes.data) {
      set({
        groups: groupsRes.data.map(g => ({
          id: g.id,
          name: g.name,
          color: g.color,
        }))
      });
    }
  },

  addContact: async (contact, userId) => {
    const id = generateId();
    const now = new Date().toISOString();
    
    const newContact: Contact = {
      ...contact,
      id,
      createdAt: now,
      isFavorite: false,
    };

    set((state) => ({ contacts: [...state.contacts, newContact] }));

    await supabase.from('nm_contacts').insert({
      id,
      user_id: userId,
      name: contact.name,
      email: contact.email,
      group_id: contact.group || null,
      is_favorite: false,
      created_at: now,
    });
  },

  updateContact: async (id, updates) => {
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));

    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.group !== undefined) updateData.group_id = updates.group || null;

    await supabase.from('nm_contacts').update(updateData).eq('id', id);
  },

  deleteContact: async (id) => {
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    }));
    await supabase.from('nm_contacts').delete().eq('id', id);
  },

  toggleFavorite: async (id) => {
    const contact = get().contacts.find(c => c.id === id);
    if (!contact) return;
    
    const newStatus = !contact.isFavorite;

    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, isFavorite: newStatus } : c
      ),
    }));

    await supabase.from('nm_contacts').update({ is_favorite: newStatus }).eq('id', id);
  },

  markUsed: async (email) => {
    const now = new Date().toISOString();
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.email === email ? { ...c, lastUsed: now } : c
      ),
    }));

    await supabase.from('nm_contacts').update({ last_used: now }).eq('email', email); // Note: might update multiple if same email, which is fine
  },

  addGroup: async (name, color, userId) => {
    const id = generateId();
    const newGroup = { id, name, color };

    set((state) => ({
      groups: [...state.groups, newGroup],
    }));

    await supabase.from('nm_contact_groups').insert({
      id,
      user_id: userId,
      name,
      color,
    });
  },

  deleteGroup: async (id) => {
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
      contacts: state.contacts.map((c) =>
        c.group === id ? { ...c, group: undefined } : c
      ),
    }));

    await Promise.all([
      supabase.from('nm_contact_groups').delete().eq('id', id),
      supabase.from('nm_contacts').update({ group_id: null }).eq('group_id', id)
    ]);
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  getFilteredContacts: () => {
    const { contacts, searchQuery } = get();
    if (!searchQuery) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  },

  getRecentContacts: (limit = 5) => {
    const { contacts } = get();
    return [...contacts]
      .filter((c) => c.lastUsed)
      .sort(
        (a, b) =>
          new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime()
      )
      .slice(0, limit);
  },

  getFavorites: () => get().contacts.filter((c) => c.isFavorite),
}));
