interface SubjectInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SubjectInput({ value, onChange }: SubjectInputProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-nm-text-tertiary uppercase tracking-wider w-8 shrink-0">
        Subj
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Subject line…"
        className="flex-1 bg-nm-surface/30 border border-nm-border-subtle rounded-xl px-4 py-2.5 text-sm text-nm-text placeholder:text-nm-muted outline-none focus:border-nm-accent/30 focus:ring-1 focus:ring-nm-accent/10 transition-all font-medium"
      />
    </div>
  );
}
