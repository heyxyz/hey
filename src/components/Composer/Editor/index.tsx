import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { FC } from 'react';
import { ERROR_MESSAGE } from 'src/constants';
import { usePublicationStore } from 'src/store/publication';

import MentionsPlugin from './AtMentionsPlugin';
import AutoLinkPlugin from './AutoLinkPlugin';
import { LENSTER_TRANSFORMERS } from './MarkdownTransformers';
import ToolbarPlugin from './ToolbarPlugin';

const onError = (error: any) => {
  console.error(error);
};

const Editor: FC = () => {
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);

  return (
    <div className="relative">
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="px-5 block text-lg mt-4 box-border h-20 z-10 overflow-auto" />
        }
        placeholder={
          <div className="px-5 absolute top-16 z-0 text-gray-400 text-lg pointer-events-none whitespace-nowrap">
            What's happening?
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
      <AutoLinkPlugin />
      <HistoryPlugin />
      <MentionsPlugin />
      <MarkdownShortcutPlugin transformers={LENSTER_TRANSFORMERS} />
    </div>
  );
};

export default Editor;
