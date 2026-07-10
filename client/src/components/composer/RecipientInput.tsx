import { useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Chip } from '@/components/ui/Chip';
import { isValidEmail } from '@/lib/utils';
import { useContactStore } from '@/store/contactStore';
import type { EmailRecipient } from '@/types';

interface RecipientInputProps {
  label: string;
  recipients: EmailRecipient[];
  onChange: (recipients: EmailRecipient[]) => void;
  placeholder?: string;
}

export function RecipientInput({
  label,
  recipients,
  onChange,
  placeholder = 'Add recipient…',
}: RecipientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const contacts = useContactStore((s) => s.contacts);

  const suggestions = inputValue.length >= 2
    ? contacts.filter(
        (c) =>
          (c.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            c.email.toLowerCase().includes(inputValue.toLowerCase())) &&
          !recipients.some((r) => r.email === c.email)
      ).slice(0, 5)
    : [];

  const addRecipient = useCallback(
    (email: string, name?: string) => {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed || !isValidEmail(trimmed)) return;
      if (recipients.some((r) => r.email === trimmed)) return;
      onChange([...recipients, { email: trimmed, name }]);
      setInputValue('');
      setShowSuggestions(false);
    },
    [recipients, onChange]
  );

  const removeRecipient = useCallback(
    (email: string) => {
      onChange(recipients.filter((r) => r.email !== email));
    },
    [recipients, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addRecipient(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && recipients.length > 0) {
      const last = recipients[recipients.length - 1];
      if (last) removeRecipient(last.email);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-2">
        <span className="text-xs font-medium text-nm-text-tertiary uppercase tracking-wider pt-2.5 w-8 shrink-0">
          {label}
        </span>
        <div
          className="flex-1 flex flex-wrap items-center gap-1.5 min-h-[40px] px-3 py-1.5 bg-nm-surface/30 border border-nm-border-subtle rounded-xl cursor-text focus-within:border-nm-accent/30 focus-within:ring-1 focus-within:ring-nm-accent/10 transition-all"
          onClick={() => inputRef.current?.focus()}
        >
          <AnimatePresence mode="popLayout">
            {recipients.map((r) => (
              <Chip
                key={r.email}
                label={r.name || r.email}
                onRemove={() => removeRecipient(r.email)}
              />
            ))}
          </AnimatePresence>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={(e) => {
              // If relatedTarget is null, it usually means the window lost focus (e.g. Alt-Tab)
              // We only want to close suggestions if the user clicked somewhere else IN the document.
              if (e.relatedTarget !== null) {
                setTimeout(() => setShowSuggestions(false), 200);
              }
              if (inputValue.trim() && isValidEmail(inputValue.trim())) {
                addRecipient(inputValue);
              }
            }}
            placeholder={recipients.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-nm-text placeholder:text-nm-muted outline-none py-1"
          />
        </div>
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-8 right-0 top-full mt-1 z-20 bg-nm-surface/95 backdrop-blur-xl border border-nm-border rounded-xl shadow-2xl overflow-hidden">
          {suggestions.map((contact) => (
            <button
              key={contact.id}
              onMouseDown={(e) => {
                e.preventDefault();
                addRecipient(contact.email, contact.name);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-nm-accent-dim flex items-center justify-center text-[10px] font-bold text-nm-accent shrink-0">
                {contact.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-nm-text truncate">{contact.name}</p>
                <p className="text-xs text-nm-text-tertiary truncate">{contact.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
