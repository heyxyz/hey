import type { FC } from 'react';

import cn from '@hey/ui/cn';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical';
import { useCallback, useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';

const ToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useUpdateEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  return (
    <div className="toolbar-icons divider flex items-center space-x-1 px-5 py-2">
      <button
        className={cn(isBold && 'bg-brand-100', 'outline-brand-500')}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        title="Bold"
        type="button"
      >
        <i className="toolbar-icon bold text-brand-500" />
      </button>
      <button
        className={cn(isItalic && 'bg-brand-100', 'outline-brand-500')}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        title="Italic"
        type="button"
      >
        <i className="toolbar-icon italic" />
      </button>
      <button
        className={cn(isCode && 'bg-brand-100', 'outline-brand-500')}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
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
