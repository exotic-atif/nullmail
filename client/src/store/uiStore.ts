import { create } from 'zustand';
import type { SidebarView } from '@/types';

interface UIStore {
  sidebarOpen: boolean;
  activeView: SidebarView;
  commandPaletteOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: SidebarView) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  sidebarOpen: false,
  activeView: 'compose',
  commandPaletteOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
