import MentionsPlugin from '@components/Shared/Lexical/Plugins/AtMentionsPlugin';
import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojiPickerPlugin from '@components/Shared/Lexical/Plugins/EmojiPicker';
import EmojisPlugin from '@components/Shared/Lexical/Plugins/EmojisPlugin';
import FloatingLinkEditorPlugin from '@components/Shared/Lexical/Plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from '@components/Shared/Lexical/Plugins/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from '@components/Shared/Lexical/Plugins/ImagesPlugin';
import { createBlockNode } from '@components/Shared/Lexical/utils';
import { Errors } from '@lenster/data/errors';
import type { ElementTransformer } from '@lexical/markdown';
import {
  $convertToMarkdownString,
  ORDERED_LIST,
  TEXT_FORMAT_TRANSFORMERS,
  UNORDERED_LIST
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { HeadingTagType } from '@lexical/rich-text';
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode
} from '@lexical/rich-text';
import { t, Trans } from '@lingui/macro';
import type { ElementNode, LexicalNode } from 'lexical';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationStore } from 'src/store/publication';

/**
 * custom markdown transformer for h2 and h3 only
 */
const HEADINGS: ElementTransformer = {
  dependencies: [HeadingNode],
  export: (
    node: LexicalNode,
    exportChildren: (node: ElementNode) => string
  ) => {
    if (!$isHeadingNode(node)) {
      return null;
    }
    const level = Number(node.getTag().slice(1));
    return '#'.repeat(level) + ' ' + exportChildren(node);
  },
  regExp: /^(#{2,3})\s/,
  replace: createBlockNode((match) => {
    const tag = ('h' + match[1].length) as HeadingTagType;
    return $createHeadingNode(tag);
  }),
  type: 'element'
};

const TRANSFORMERS = [
  ...TEXT_FORMAT_TRANSFORMERS,
  HEADINGS,
  ORDERED_LIST,
  UNORDERED_LIST
];

const Editor: FC = () => {
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );
  const showPollEditor = usePublicationStore((state) => state.showPollEditor);
  const attachments = usePublicationStore((state) => state.attachments);
  const { handleUploadAttachments } = useUploadAttachments();
  const [editor] = useLexicalComposerContext();

  const handlePaste = async (pastedFiles: FileList) => {
    if (
      attachments.length === 4 ||
      attachments.length + pastedFiles.length > 4
    ) {
      return toast.error(t`Please choose either 1 video or up to 4 photos.`);
    }

    if (pastedFiles) {
      await handleUploadAttachments(pastedFiles);
    }
  };

  // remove this for now because it doesnt allow lexical to create two line breaks to register it
  // useEffect(() => {
  //   return editor.registerCommand(
  //     INSERT_PARAGRAPH_COMMAND,
  //     () => {
  //       editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, false);
  //       return true;
  //     },
  //     COMMAND_PRIORITY_NORMAL
  //   );
  // }, [editor]);

  return (
    <div className="relative">
      <EmojiPickerPlugin />
      <LinkPlugin />
      <FloatingTextFormatToolbarPlugin />
      <FloatingLinkEditorPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="my-4 block min-h-[65px] overflow-auto px-5" />
        }
        placeholder={
          <div className="pointer-events-none absolute top-0 whitespace-nowrap px-5 text-gray-400">
            {showPollEditor ? (
              <Trans>Ask a question...</Trans>
            ) : (
              <Trans>What's happening?</Trans>
            )}
          </div>
        }
        ErrorBoundary={() => <div>{Errors.SomethingWentWrong}</div>}
      />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            setPublicationContent(markdown);
          });
        }}
      />
      <EmojisPlugin />
      <LexicalAutoLinkPlugin />
      <HistoryPlugin />
      <HashtagPlugin />
      <MentionsPlugin />
      <ImagesPlugin onPaste={handlePaste} />
    </div>
  );
};

export default Editor;
