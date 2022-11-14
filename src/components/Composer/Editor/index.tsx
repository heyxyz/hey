import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import ToolbarPlugin from '@components/Shared/Lexical/Plugins/ToolbarPlugin';
import { $convertToMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $setSelection
} from 'lexical';
import { type FC, useEffect } from 'react';
import { ERROR_MESSAGE } from 'src/constants';
import { usePublicationStore } from 'src/store/publication';

import MentionsPlugin from '../../Shared/Lexical/Plugins/AtMentionsPlugin';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

interface EditorProps {
  placeholder?: string;
  defaultContent?: string;
}

const Editor: FC<EditorProps> = ({ defaultContent, placeholder }) => {
  const [editor] = useLexicalComposerContext();
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);

  useEffect(() => {
    editor.update(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);

      // Only insert defaultContent if editor has empty value
      if (defaultContent && markdown.trim() === '') {
        // Get the RootNode from the EditorState
        const root = $getRoot();

        // Create a new ParagraphNode
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(defaultContent);
        paragraphNode.append(textNode);

        // Remove empty paragraph which is present if user edits content
        root.clear();
        root.append(paragraphNode);

        // Move cursor to end of defaultContent
        const newSelection = $createRangeSelection();
        newSelection.setTextNodeRange(textNode, defaultContent.length, textNode, defaultContent.length);
        $setSelection(newSelection);
      }
    });
  }, [editor, defaultContent]);

  return (
    <div className="relative">
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable tabIndex={1} className="px-5 block my-4 min-h-[65px] overflow-auto" />
        }
        placeholder={
          <div className="px-5 absolute top-[65px] text-gray-400 pointer-events-none whitespace-nowrap">
            {placeholder}
          </div>
        }
        ErrorBoundary={() => <div>{ERROR_MESSAGE}</div>}
      />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            setPublicationContent(markdown);
          });
        }}
      />
      <LexicalAutoLinkPlugin />
      <HistoryPlugin />
      <HashtagPlugin />
      <MentionsPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </div>
  );
};

Editor.defaultProps = {
  placeholder: '',
  defaultContent: 'Hello world'
};

export default Editor;
