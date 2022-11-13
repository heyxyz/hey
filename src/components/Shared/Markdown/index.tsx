import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import type { LensterPublication } from '@generated/lenstertypes';
import type { ElementTransformer } from '@lexical/markdown';
import { $convertFromMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { ElementNode, LexicalNode } from 'lexical';
import type { FC } from 'react';
import { ERROR_MESSAGE } from 'src/constants';

import MentionsPlugin, { AtSignMentionsRegex } from '../../Shared/Lexical/Plugins/AtMentionsPlugin';
import { $createMentionNode, MentionNode } from '../Lexical/Nodes/MentionsNode';

const createBlockNode = (
  createNode: (match: Array<string>) => ElementNode & MentionNode
): ElementTransformer['replace'] => {
  return (parentNode, children, match) => {
    const node = createNode(match);
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  };
};
const TRANSFORMERS = [
  ...TEXT_FORMAT_TRANSFORMERS,
  {
    dependencies: [MentionNode],
    export: () => {
      return null;
    },
    regExp: AtSignMentionsRegex,
    replace: (parentNode: ElementNode, children: Array<LexicalNode>, match: Array<String>) => {
      const node = $createMentionNode(match[0].split('@')[1]);
      parentNode.replace(node);
      node.select(0, 0);
      return;
    },
    type: 'element'
  }
];

interface Props {
  publication: LensterPublication;
}

const Markdown: FC<Props> = ({ publication }) => {
  const [editor] = useLexicalComposerContext();

  editor.update(() => {
    // @ts-expect-error
    $convertFromMarkdownString(publication?.metadata?.content, TRANSFORMERS);
  });

  return (
    <div className="relative preview">
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder=""
        ErrorBoundary={() => <div>{ERROR_MESSAGE}</div>}
      />
      <LexicalAutoLinkPlugin />
      <HistoryPlugin />
      <HashtagPlugin />
      <MentionsPlugin />
    </div>
  );
};

export default Markdown;
