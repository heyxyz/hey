import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import type { LensterPublication } from '@generated/lenstertypes';
import { $convertFromMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { FC } from 'react';
import { ERROR_MESSAGE } from 'src/constants';

import MentionsPlugin from '../../Shared/Lexical/Plugins/AtMentionsPlugin';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

interface Props {
  publication: LensterPublication;
}

const Markdown: FC<Props> = ({ publication }) => {
  const [editor] = useLexicalComposerContext();

  editor.update(() => {
    $convertFromMarkdownString(publication?.metadata?.content, TRANSFORMERS);
  });

  return (
    <div className="relative">
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
