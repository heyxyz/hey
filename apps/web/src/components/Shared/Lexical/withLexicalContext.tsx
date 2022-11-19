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
      bold: 'text-bold',
      italic: 'text-italic',
      code: 'text-sm bg-gray-300 rounded-lg dark:bg-gray-700 px-[5px] py-[2px]'
    },
    link: 'text-brand',
    hashtag: 'text-brand'
  },
  nodes: [CodeNode, MentionNode, HashtagNode, AutoLinkNode, LinkNode, EmojiNode],
  editorState: null,
  onError: (error: any) => {
    console.error(error);
  }
};

const withLexicalContext = (Component: FC<any>, editable = true) => {
  const LexicalContext = (props: any) => (
    <LexicalComposer initialConfig={{ ...initialConfig, editable }}>
      <Component {...props} />
    </LexicalComposer>
  );

  LexicalContext.displayName = 'EditorContext';
  return LexicalContext;
};

export default withLexicalContext;
