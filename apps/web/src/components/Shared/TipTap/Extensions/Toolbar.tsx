import type { FC } from 'react';

import cn from '@hey/ui/cn';
import { type Editor } from '@tiptap/react';

interface ToolBarProps {
  editor: Editor;
}

const ToolbarPlugin: FC<ToolBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="toolbar-icons divider flex items-center space-x-1 px-5 py-2">
      <button
        className={cn(
          editor.isActive('bold') && 'bg-brand-100',
          'outline-brand-500'
        )}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
        type="button"
      >
        <i className="toolbar-icon bold text-brand-500" />
      </button>
      <button
        className={cn(
          editor.isActive('italic') && 'bg-brand-100',
          'outline-brand-500'
        )}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
        title="Italic"
        type="button"
      >
        <i className="toolbar-icon italic" />
      </button>
      <button
        className={cn(
          editor.isActive('code') && 'bg-brand-100',
          'outline-brand-500'
        )}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        onClick={() => {
          editor.chain().focus().toggleCode().run();
        }}
        title="Code"
        type="button"
      >
        <i className="toolbar-icon code" />
      </button>
    </div>
  );
};

export default ToolbarPlugin;
