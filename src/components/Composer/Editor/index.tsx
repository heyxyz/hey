import { CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import type { FC } from 'react';
import { ERROR_MESSAGE } from 'src/constants';
import { usePublicationStore } from 'src/store/publication';

import MentionsPlugin from './AtMentionsPlugin';
import AutoLinkPlugin from './AutoLinkPlugin';
import { LENSTER_TRANSFORMERS } from './MarkdownTransformers';
import { MentionNode } from './MentionsNode';
import ToolbarPlugin from './ToolbarPlugin';

const onError = (error: any) => {
  console.error(error);
};

const Editor: FC = () => {
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);

  const initialConfig = {
    namespace: 'composer',
    theme: {
      link: 'text-brand hover:text-brand-600 dark:hover:text-brand-500',
      text: {
        bold: 'text-bold text-bold',
        code: 'text-code',
        italic: 'text-italic italic',
        strikethrough: 'text-strikethrough strikethrough',
        subscript: 'text-subscript subscript',
        superscript: 'text-superscript superscript',
        underline: 'text-underline underline',
        underlineStrikethrough: 'text-underline-strike-through underline line-through'
      },
      quote: 'mb-5 ml-10 border-brand-500 border-l-4 pl-4'
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      CodeNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      MentionNode,
      AutoLinkNode,
      LinkNode
    ],
    editorState: null,
    onError
  };

  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
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
      </LexicalComposer>
    </div>
  );
};

export default Editor;
