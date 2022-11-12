import { CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { MentionNode } from '../Editor/MentionsNode';

const onError = (error: any) => {
  console.error(error);
};
const initialConfig = {
  namespace: 'composer',
  theme: {
    link: 'text-brand hover:text-brand-600 dark:hover:text-brand-500',
    text: {
      bold: 'text-bold text-bold',
      code: 'text-sm bg-gray-300 rounded-lg dark:bg-gray-700 px-[5px] py-[2px]',
      italic: 'text-italic italic'
    },
    hashtag: 'text-brand'
  },
  nodes: [CodeNode, MentionNode, AutoLinkNode, LinkNode, HashtagNode],
  editorState: null,
  onError
};

const EditorContextProvider = (props: any) => {
  return <LexicalComposer initialConfig={initialConfig} {...props} />;
};

export default EditorContextProvider;
