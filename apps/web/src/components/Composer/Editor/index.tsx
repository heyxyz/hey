import MentionsPlugin from '@components/Shared/Lexical/Plugins/AtMentionsPlugin';
import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojiPickerPlugin from '@components/Shared/Lexical/Plugins/EmojiPicker';
import EmojisPlugin from '@components/Shared/Lexical/Plugins/EmojisPlugin';
import ImagesPlugin from '@components/Shared/Lexical/Plugins/ImagesPlugin';
import ToolbarPlugin from '@components/Shared/Lexical/Plugins/ToolbarPlugin';
import useUploadAttachments from '@components/utils/hooks/useUploadAttachments';
import { $convertToMarkdownString, TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { t, Trans } from '@lingui/macro';
import Errors from 'data/errors';
import type { LexicalCommand } from 'lexical';
import { $createParagraphNode, $createTextNode, $getRoot, createCommand } from 'lexical';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

const QUADRATIC_ROUND_SELECTED_COMMAND: LexicalCommand<string> = createCommand();
const UPDATE_EDITOR_CONTENT_COMMAND: LexicalCommand<string> = createCommand();

interface Props {
  selectedQuadraticRound: string;
}

const Editor: FC<Props> = ({ selectedQuadraticRound }) => {
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const attachments = usePublicationStore((state) => state.attachments);
  const { handleUploadAttachments } = useUploadAttachments();
  const [editor] = useLexicalComposerContext();
  const prevQuadraticRoundRef = useRef('');
  const [roundNotifications, setRoundNotifications] = useState<string>('');

  const handlePaste = async (pastedFiles: FileList) => {
    if (attachments.length === 4 || attachments.length + pastedFiles.length > 4) {
      return toast.error(t`Please choose either 1 video or up to 4 photos.`);
    }

    if (pastedFiles) {
      await handleUploadAttachments(pastedFiles);
    }
  };

  useEffect(() => {
    prevQuadraticRoundRef.current = selectedQuadraticRound;
  }, []);

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

  useEffect(() => {
    const prevQuadraticRound = prevQuadraticRoundRef.current;

    if (selectedQuadraticRound !== prevQuadraticRound) {
      // editor.update(() => {
      //   const root = $getRoot();
      //   const textContent = root.getTextContent();

      //   const notificationString = `Your post will be included in the ${prevQuadraticRound} round.`;
      //   const regex = new RegExp(notificationString.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'), 'g');
      //   root.remove()
      //   console.log('textContent', textContent);
      // });

      const newNotification = `Your post will be included in the ${selectedQuadraticRound} round.`;

      editor.update(() => {
        const p = $createParagraphNode();
        p.append($createTextNode(newNotification));
        $getRoot().append(p);
      });

      prevQuadraticRoundRef.current = selectedQuadraticRound;
    }
  }, [selectedQuadraticRound, editor, publicationContent, setPublicationContent]);

  // console.log('publicationContent2', publicationContent);

  return (
    <div className="relative">
      <EmojiPickerPlugin />
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="my-4 block min-h-[65px] overflow-auto px-5" />}
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
      <HistoryPlugin />
      <HashtagPlugin />
      <MentionsPlugin />
      <ImagesPlugin onPaste={handlePaste} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </div>
  );
};

export default Editor;
