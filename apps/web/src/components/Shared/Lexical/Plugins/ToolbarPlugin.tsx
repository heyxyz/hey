import type { FC } from 'react';

import cn from '@hey/ui/cn';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical';
import { useCallback, useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';
import { Editor } from '@tiptap/react';

interface ToolbarPluginProps {
  tiptapeditor: Editor | undefined ;
}

const ToolbarPlugin: FC<ToolbarPluginProps> = ({ tiptapeditor }) => {
  if (!tiptapeditor) return null;

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);

  useUpdateEffect(() => {
    // Use the Tiptap editor event listeners to update the toolbar state
    if (!tiptapeditor) return;

    const handleEditorUpdate = () => {
      const { storedMarks } = tiptapeditor.state;
      // TODO: complete here
      // setIsBold(storedMarks .bold !== undefined);
      // setIsItalic(storedMarks .italic !== undefined);
      // setIsCode(storedMarks .code !== undefined);
    };

    tiptapeditor.on('update', handleEditorUpdate);

    return () => {
      tiptapeditor.off('update', handleEditorUpdate);
    };
  }, [tiptapeditor]);

  return (
    <div className="toolbar-icons divider flex items-center space-x-1 px-5 py-2">
      <button
        className={cn(isBold && 'bg-brand-100', 'outline-brand-500')}
        onClick={() => {
          tiptapeditor.chain().focus().toggleBold().run();
        }}
        title="Bold"
        type="button"
      >
        <i className="toolbar-icon bold text-brand-500" />
      </button>
      <button
        className={cn(isItalic && 'bg-brand-100', 'outline-brand-500')}
        onClick={() => {
          tiptapeditor.chain().focus().toggleItalic().run();
        }}
        title="Italic"
        type="button"
      >
        <i className="toolbar-icon italic" />
      </button>
      <button
        className={cn(isCode && 'bg-brand-100', 'outline-brand-500')}
        onClick={() => {
          tiptapeditor.chain().focus().toggleCode().run();
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
