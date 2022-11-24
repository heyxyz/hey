import Beta from '@components/Shared/Badges/Beta';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

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

  useEffect(() => {
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
    <div className="flex items-center justify-between border-b px-5 py-2">
      <div className="w-full flex toolbar-icons space-x-1">
        <button
          className={isBold ? 'bg-brand-100' : ''}
          title="Bold"
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
        >
          <i className="toolbar-icon bold text-brand-500" />
        </button>
        <button
          className={isItalic ? 'bg-brand-100' : ''}
          title="Italic"
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
        >
          <i className="toolbar-icon italic" />
        </button>
        <button
          className={isCode ? 'bg-brand-100' : ''}
          title="Code"
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
          }}
        >
          <i className="toolbar-icon code" />
        </button>
      </div>
      <Beta />
    </div>
  );
};

export default ToolbarPlugin;
