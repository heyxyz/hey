import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojisPlugin from '@components/Shared/Lexical/Plugins/EmojisPlugin';
import ToolbarPlugin from '@components/Shared/Lexical/Plugins/ToolbarPlugin';
import { $convertToMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ERROR_MESSAGE } from 'data/constants';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';

import MentionsPlugin from '../../Shared/Lexical/Plugins/AtMentionsPlugin';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

const Editor: FC = () => {
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);

  return (
    <div className="relative">
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="px-5 block my-4 min-h-[65px] overflow-auto" />}
        placeholder={
          <div className="px-5 absolute top-[65px] text-gray-400 pointer-events-none whitespace-nowrap">
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
      <EmojisPlugin />
      <LexicalAutoLinkPlugin />
      <HistoryPlugin />
      <HashtagPlugin />
      <MentionsPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </div>
  );
};

export default Editor;
