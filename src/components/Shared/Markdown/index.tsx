import LexicalAutoLinkPlugin, { URL_MATCHER } from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import type { LensterPublication } from '@generated/lenstertypes';
import { $createLinkNode, LinkNode } from '@lexical/link';
import { $convertFromMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { ElementNode, LexicalNode } from 'lexical';
import { $createTextNode } from 'lexical';
import type { FC } from 'react';
import { ERROR_MESSAGE } from 'src/constants';

import MentionsPlugin, { AtSignMentionsRegex } from '../../Shared/Lexical/Plugins/AtMentionsPlugin';
import { $createReadOnlyMentionNode, MentionNode } from '../Lexical/Nodes/MentionsNode';

const TRANSFORMERS = [
  ...TEXT_FORMAT_TRANSFORMERS,
  {
    dependencies: [MentionNode],
    export: () => {
      return null;
    },
    regExp: AtSignMentionsRegex,
    replace: (parentNode: ElementNode, children: Array<LexicalNode>, match: Array<String>) => {
      // we have to check if the match is a valid mention and then convert it to mentionNode
      const node = $createReadOnlyMentionNode(match[0].split('@')[1]);
      parentNode.replace(node);
      node.select(0, 0);
      return;
    },
    type: 'element'
  },
  {
    dependencies: [LinkNode],
    export: () => {
      return null;
    },
    importRegExp: /\[([^[]+)]\(([^(]+)\)/,
    regExp: URL_MATCHER,
    replace: (textNode: ElementNode, match: Array<string>) => {
      const [, linkText, linkUrl] = match;
      const linkNode = $createLinkNode(linkUrl, {
        rel: 'noreferrer',
        target: '_blank'
      });
      const linkTextNode = $createTextNode(linkText);
      linkTextNode.setFormat(textNode.getFormat());
      linkNode.append(linkTextNode);
      textNode.replace(linkNode);
    },
    trigger: ')',
    type: 'text-match'
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
