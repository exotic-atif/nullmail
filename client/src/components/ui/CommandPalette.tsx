import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PenSquare, FileText, Users, LayoutGrid, Settings, Copy, Download, Upload, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  shortcut?: string;
}

export function CommandPalette() {
  const isOpen = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(
    () => [
      { id: 'compose', label: 'New Email', icon: <PenSquare size={16} />, action: () => { navigate('/'); setOpen(false); }, category: 'Navigation', shortcut: '' },
      { id: 'drafts', label: 'Open Drafts', icon: <FileText size={16} />, action: () => { navigate('/drafts'); setOpen(false); }, category: 'Navigation' },
      { id: 'contacts', label: 'Manage Contacts', icon: <Users size={16} />, action: () => { navigate('/contacts'); setOpen(false); }, category: 'Navigation' },
      { id: 'templates', label: 'Browse Templates', icon: <LayoutGrid size={16} />, action: () => { navigate('/templates'); setOpen(false); }, category: 'Navigation' },
      { id: 'settings', label: 'Open Settings', icon: <Settings size={16} />, action: () => { navigate('/settings'); setOpen(false); }, category: 'Navigation' },
      { id: 'send', label: 'Send Email', icon: <Send size={16} />, action: () => setOpen(false), category: 'Actions', shortcut: 'Ctrl+Enter' },
      { id: 'copy-html', label: 'Copy HTML', icon: <Copy size={16} />, action: () => setOpen(false), category: 'Actions' },
      { id: 'export', label: 'Export HTML', icon: <Download size={16} />, action: () => setOpen(false), category: 'Actions' },
      { id: 'import', label: 'Import HTML', icon: <Upload size={16} />, action: () => setOpen(false), category: 'Actions' },
    ],
    [navigate, setOpen]
  );

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [query, commands]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-md bg-nm-surface/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
              <Search size={16} className="text-nm-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command…"
                className="w-full bg-transparent text-sm text-nm-text placeholder:text-nm-muted outline-none"
              />
              <kbd className="text-[10px] text-nm-muted bg-nm-surface px-1.5 py-0.5 rounded border border-nm-border-subtle font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[280px] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="text-sm text-nm-muted text-center py-6">
                  No results found
                </p>
              )}

              {filtered.map((command, index) => (
                <button
                  key={command.id}
                  onClick={command.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    index === selectedIndex
                      ? 'bg-white/5 text-nm-text'
                      : 'text-nm-text-secondary hover:bg-white/[0.03]'
                  }`}
                >
                  <span
                    className={
                      index === selectedIndex ? 'text-nm-accent' : 'text-nm-muted'
                    }
                  >
                    {command.icon}
                  </span>
                  <span className="flex-1 text-left">{command.label}</span>
                  {command.shortcut && (
                    <kbd className="text-[10px] text-nm-muted bg-nm-surface px-1.5 py-0.5 rounded border border-nm-border-subtle font-mono">
                      {command.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
