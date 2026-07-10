import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';

interface ShortcutHandlers {
  onSend?: () => void;
  onSaveDraft?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onLink?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+P → Command Palette
      if (isCtrl && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Ctrl+Enter → Send
      if (isCtrl && e.key === 'Enter') {
        e.preventDefault();
        handlers.onSend?.();
        return;
      }

      // Ctrl+S → Save Draft
      if (isCtrl && e.key === 's') {
        e.preventDefault();
        handlers.onSaveDraft?.();
        return;
      }

      // Ctrl+B → Bold (handled by TipTap but we intercept for custom logic)
      if (isCtrl && e.key === 'b') {
        handlers.onBold?.();
        return;
      }

      // Ctrl+I → Italic
      if (isCtrl && e.key === 'i') {
        handlers.onItalic?.();
        return;
      }

      // Ctrl+K → Link
      if (isCtrl && e.key === 'k') {
        e.preventDefault();
        handlers.onLink?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, setCommandPaletteOpen]);
}
