import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),

      setTheme: (theme) => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
        set({ theme });
      },

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          const root = document.documentElement;
          root.classList.remove('dark', 'light');
          root.classList.add(newTheme);
          return { theme: newTheme };
        }),
    }),
    { name: 'nullmail-theme' }
  )
);
