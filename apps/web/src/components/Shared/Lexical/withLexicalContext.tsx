import { CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HeadingNode } from '@lexical/rich-text';
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
    list: {
      listitem: 'my-0 mx-1',
      nested: {
        listitem: 'list-none after:hidden before:hidden'
      },
      olDepth: ['list-inside', 'list-inside list-upper-alpha'],
      ul: 'p-0 m-0 list-inside !list-disc',
      ol: 'p-0 m-0 list-inside !list-decimal'
    },
    link: 'text-brand',
    hashtag: 'text-brand',
    heading: {
      h2: 'text-2xl font-bold',
      h3: 'text-xl font-bold'
    }
  },
  nodes: [
    CodeNode,
    ListNode,
    ListItemNode,
    HeadingNode,
    MentionNode,
    HashtagNode,
    AutoLinkNode,
    LinkNode,
    EmojiNode
  ],
  editorState: null,
  onError: () => {}
};

const withLexicalContext = (Component: FC<any>) => {
  const LexicalContext = (props: any) => (
    <LexicalComposer initialConfig={initialConfig}>
      <Component {...props} />
    </LexicalComposer>
  );

  return LexicalContext;
};

export default withLexicalContext;
