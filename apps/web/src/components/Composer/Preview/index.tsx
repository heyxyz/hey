import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import { MentionsRenderPlugin } from '@components/Shared/Lexical/Plugins/MentionsRenderPlugin';
import type { LensterPublication } from '@generated/types';
import { $convertFromMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ERROR_MESSAGE } from 'data/constants';
import type { FC } from 'react';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

interface Props {
  publication: LensterPublication;
}

const MarkdownRenderer: FC<Props> = ({ publication }) => {
  const [editor] = useLexicalComposerContext();

  editor.update(() => {
    const content = publication?.metadata?.content;
    $convertFromMarkdownString(content, TRANSFORMERS);
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
      <MentionsRenderPlugin />
    </div>
  );
};

export default MarkdownRenderer;
