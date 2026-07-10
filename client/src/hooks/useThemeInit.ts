import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function useThemeInit() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);
}
