import { create } from 'zustand';
import type { EmailTemplate } from '@/types';

interface TemplateStore {
  selectedTemplate: EmailTemplate | null;
  searchQuery: string;
  setSelectedTemplate: (template: EmailTemplate | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useTemplateStore = create<TemplateStore>()((set) => ({
  selectedTemplate: null,
  searchQuery: '',
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
