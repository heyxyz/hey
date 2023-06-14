import { EmojiNode } from '@components/Shared/Lexical/Nodes/EmojiNode';
import MentionsPlugin from '@components/Shared/Lexical/Plugins/AtMentionsPlugin';
import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojiPickerPlugin from '@components/Shared/Lexical/Plugins/EmojiPicker';
import EmojisPlugin from '@components/Shared/Lexical/Plugins/EmojisPlugin';
import ImagesPlugin from '@components/Shared/Lexical/Plugins/ImagesPlugin';
import ToolbarPlugin from '@components/Shared/Lexical/Plugins/ToolbarPlugin';
import useUploadAttachments from '@components/utils/hooks/useUploadAttachments';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode } from '@lexical/link';
import { $convertToMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { t, Trans } from '@lingui/macro';
import { focusManager } from '@tanstack/react-query';
import Errors from 'data/errors';
import type { LexicalEditor } from 'lexical';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];


interface Props {
  selectedQuadraticRound: string;
}

interface BannerProps {
  selectedQuadraticRound: string;
  editor: LexicalEditor;
}

const RoundBanner: FC<BannerProps> = ({ selectedQuadraticRound, editor }) => {
  const prevQuadraticRoundRef = useRef('');

  useEffect(() => {
    const prevQuadraticRound = prevQuadraticRoundRef.current;

    if (selectedQuadraticRound !== prevQuadraticRound) {
      const newNotification = `Your post will be included in the ${selectedQuadraticRound} round.`;
      editor.update(() => {
        const p = $createParagraphNode();
        const root = $getRoot();
        root?.clear();
        p.append($createTextNode(newNotification));
        root.append(p);
        console.log('updated', newNotification);
      });
      prevQuadraticRoundRef.current = selectedQuadraticRound;
    }
    editor.setEditable(false);
  }, [selectedQuadraticRound, editor]);

  return (
    <div className="relative">
      <PlainTextPlugin
        contentEditable={<ContentEditable className="block min-h-[25px] overflow-auto px-5" />}
        placeholder={
          <div className="pointer-events-none absolute top-[2px] whitespace-nowrap px-5 text-gray-400" />
        }
        ErrorBoundary={() => <div>{Errors.SomethingWentWrong}</div>}
      />
    </div>
  );
};

const Editor: FC<Props> = ({ selectedQuadraticRound }) => {
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const attachments = usePublicationStore((state) => state.attachments);
  const { handleUploadAttachments } = useUploadAttachments();
  const [editor] = useLexicalComposerContext();

  focusManager;

  const handlePaste = async (pastedFiles: FileList) => {
    if (attachments.length === 4 || attachments.length + pastedFiles.length > 4) {
      return toast.error(t`Please choose either 1 video or up to 4 photos.`);
    }

    if (pastedFiles) {
      await handleUploadAttachments(pastedFiles);
    }
  };

  return (
    <div className="relative">
      <LexicalComposer
        initialConfig={{
          namespace: 'content',
          onError(error, editor) {
            console.error(error);
          },
          editable: true,
          nodes: [EmojiNode, HashtagNode, AutoLinkNode]
        }}
      >
        <EmojiPickerPlugin />
        <ToolbarPlugin />
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="my-4 block min-h-[65px] overflow-auto px-2" />}
          placeholder={
            <div className="pointer-events-none absolute top-[65px] whitespace-nowrap px-5 text-gray-400">
              <Trans>What's happening?</Trans>
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
        <ClearEditorPlugin />
        <HistoryPlugin />
        <HashtagPlugin />
        <MentionsPlugin />
        <ImagesPlugin onPaste={handlePaste} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </LexicalComposer>
      <RoundBanner selectedQuadraticRound={selectedQuadraticRound} editor={editor} />
    </div>
  );
};

export { Editor, RoundBanner };
