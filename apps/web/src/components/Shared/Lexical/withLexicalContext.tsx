import type { FC } from 'react';

import { CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { MentionNode } from './Nodes/MentionsNode';

const initialConfig = {
  editorState: null,
  namespace: 'composer',
  nodes: [CodeNode, MentionNode, HashtagNode, AutoLinkNode, LinkNode],
  onError: () => {},
  theme: {
    hashtag: 'text-brand-500',
    link: 'text-brand-500',
    text: {
      bold: 'bold',
      code: 'text-sm bg-gray-300 rounded-lg dark:bg-gray-700 px-[5px] py-[2px]',
      italic: 'italic'
    }
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
