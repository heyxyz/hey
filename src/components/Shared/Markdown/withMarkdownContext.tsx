import { MentionNode } from '@components/Shared/Lexical/Nodes/MentionsNode';
import { CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import type { FC } from 'react';

const initialConfig = {
  namespace: 'composer',
  theme: {
    text: {
      bold: 'text-bold',
      italic: 'text-italic',
      code: 'text-sm bg-gray-300 rounded-lg dark:bg-gray-700 px-[5px] py-[2px]'
    },
    link: 'text-brand',
    hashtag: 'text-brand'
  },
  nodes: [CodeNode, MentionNode, HashtagNode, AutoLinkNode, LinkNode],
  editorState: null,
  onError: (error: any) => {
    console.error(error);
  }
};

const withMarkdownContext = (Component: FC<any>) => {
  const MarkdownContext = (props: any) => (
    <MarkdownContext initialConfig={initialConfig}>
      <Component {...props} />
    </MarkdownContext>
  );

  MarkdownContext.displayName = 'MarkdownContext';
  return MarkdownContext;
};

export default withMarkdownContext;
