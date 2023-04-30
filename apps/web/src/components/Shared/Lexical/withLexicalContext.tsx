import { CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { FC } from 'react';

import { EmojiNode } from './Nodes/EmojiNode';
import { MentionNode } from './Nodes/MentionsNode';

const initialConfig = {
  namespace: 'composer',
  theme: {
    text: {
      bold: 'bold',
      italic: 'italic',
      code: 'text-sm bg-gray-300 rounded-lg dark:bg-gray-700 px-[5px] py-[2px]'
    },
    link: 'text-brand',
    hashtag: 'text-brand'
  },
  nodes: [
    CodeNode,
    MentionNode,
    HashtagNode,
    AutoLinkNode,
    LinkNode,
    EmojiNode
  ],
  editorState: null,
  onError: (error: Error) => {
    console.error(error);
  }
};

const withLexicalContext = (Component: FC<any>) => {
  const LexicalContext = (props: any) => (
    <LexicalComposer initialConfig={{ ...initialConfig }}>
      <Component {...props} />
    </LexicalComposer>
  );

  return LexicalContext;
};

export default withLexicalContext;
