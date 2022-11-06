import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $wrapNodes } from '@lexical/selection';
import { $getNearestNodeOfType } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isSuperScript, setIsSuperScript] = useState(false);
  const [isSubScript, setIsSubScript] = useState(false);

  const [blockType, setBlockType] = useState('paragraph');
  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsSubScript(selection.hasFormat('subscript'));
      setIsSuperScript(selection.hasFormat('superscript'));
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();

      const elementDOM = activeEditor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [activeEditor]);

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
    <div className="h-8 w-full bg flex toolbar-icons">
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'spaced ' + (isBold ? 'bg-brand-100' : '')}
        title={'Bold'}
        aria-label={`Format text as bold.`}
      >
        <i className="toolbar-icon bold text-brand-500" />
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'spaced ' + (isItalic ? 'bg-brand-100' : '')}
        title={'Italic'}
        aria-label={`Format text as italic.`}
      >
        <i className="toolbar-icon italic" />
      </button>
      {/* underline is not supported in markdown */}
      {/* <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'spaced ' + (isBold ? 'active' : '')}
        title={'Bold'}
        aria-label={`Format text as bold.`}
      >
        U
      </button> */}
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        }}
        className={'spaced ' + (isSuperScript ? 'bg-brand-100' : '')}
        title={'Superscript'}
        aria-label={`Format text as superscript.`}
      >
        <i className="toolbar-icon superscript" />
      </button>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        }}
        className={'spaced ' + (isSubScript ? 'bg-brand-100' : '')}
        title={'Subscript'}
        aria-label={`Format text as subscript.`}
      >
        <i className="toolbar-icon subscript" />
      </button>
      <button onClick={formatQuote} title={'Bold'} aria-label={`Format text as quote.`}>
        <i className="toolbar-icon quote" />
      </button>
    </div>
  );
}
