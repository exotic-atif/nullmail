import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough, Code, Quote,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  Undo, Redo, Heading1, Heading2, Heading3, Minus, Highlighter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToolbarButton({ icon, label, isActive, onClick, disabled }: ToolbarButtonProps) {
  return (
    <Tooltip content={label}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'p-1.5 rounded-lg transition-all duration-150 cursor-pointer',
          isActive
            ? 'bg-nm-accent/15 text-nm-accent'
            : 'text-nm-text-tertiary hover:text-nm-text hover:bg-white/5',
          disabled && 'opacity-30 cursor-not-allowed'
        )}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-nm-border-subtle mx-1" />;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const s = 15;

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 bg-nm-surface/40 border border-nm-border-subtle border-b-0 rounded-t-2xl flex-wrap">
      {/* Headings */}
      <ToolbarButton icon={<Heading1 size={s} />} label="Heading 1" isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
      <ToolbarButton icon={<Heading2 size={s} />} label="Heading 2" isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      <ToolbarButton icon={<Heading3 size={s} />} label="Heading 3" isActive={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />

      <Divider />

      {/* Formatting */}
      <ToolbarButton icon={<Bold size={s} />} label="Bold (Ctrl+B)" isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarButton icon={<Italic size={s} />} label="Italic (Ctrl+I)" isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolbarButton icon={<Underline size={s} />} label="Underline" isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <ToolbarButton icon={<Strikethrough size={s} />} label="Strikethrough" isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
      <ToolbarButton icon={<Code size={s} />} label="Inline Code" isActive={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
      <ToolbarButton icon={<Highlighter size={s} />} label="Highlight" isActive={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} />

      <Divider />

      {/* Alignment */}
      <ToolbarButton icon={<AlignLeft size={s} />} label="Align Left" isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
      <ToolbarButton icon={<AlignCenter size={s} />} label="Align Center" isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
      <ToolbarButton icon={<AlignRight size={s} />} label="Align Right" isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />

      <Divider />

      {/* Lists */}
      <ToolbarButton icon={<List size={s} />} label="Bullet List" isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolbarButton icon={<ListOrdered size={s} />} label="Ordered List" isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <ToolbarButton icon={<Quote size={s} />} label="Blockquote" isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <ToolbarButton icon={<Minus size={s} />} label="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />

      <Divider />

      {/* Insert */}
      <ToolbarButton icon={<LinkIcon size={s} />} label="Link (Ctrl+K)" isActive={editor.isActive('link')} onClick={addLink} />
      <ToolbarButton icon={<ImageIcon size={s} />} label="Image" onClick={addImage} />
      <ToolbarButton icon={<TableIcon size={s} />} label="Table" onClick={addTable} />

      <Divider />

      {/* History */}
      <ToolbarButton icon={<Undo size={s} />} label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
      <ToolbarButton icon={<Redo size={s} />} label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
    </div>
  );
}
