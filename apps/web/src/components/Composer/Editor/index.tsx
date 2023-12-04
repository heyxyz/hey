import type { FC } from 'react';

import MentionsPlugin from '@components/Shared/Lexical/Plugins/AtMentionsPlugin';
import LexicalAutoLinkPlugin from '@components/Shared/Lexical/Plugins/AutoLinkPlugin';
import EmojiPickerPlugin from '@components/Shared/Lexical/Plugins/EmojiPicker';
import ImagesPlugin from '@components/Shared/Lexical/Plugins/ImagesPlugin';
import ToolbarPlugin from '@components/Shared/Lexical/Plugins/ToolbarPlugin';
import { Errors } from '@hey/data/errors';
import {
  $convertToMarkdownString,
  TEXT_FORMAT_TRANSFORMERS
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  COMMAND_PRIORITY_NORMAL,
  INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND
} from 'lexical';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

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
      return toast.error('Please choose either 1 video or up to 4 photos.');
    }

    if (pastedFiles) {
      await handleUploadAttachments(pastedFiles);
    }
  };

  useEffect(() => {
    return editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => {
        editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND, false);
        return true;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);

  return (
    <div className="relative">
      <EmojiPickerPlugin />
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="my-4 block min-h-[65px] overflow-auto px-5" />
        }
        ErrorBoundary={() => <div>{Errors.SomethingWentWrong}</div>}
        placeholder={
          <div className="pointer-events-none absolute top-[65px] whitespace-nowrap px-5 text-gray-400">
            {showPollEditor ? 'Ask a question...' : "What's happening?"}
          </div>
        }
      />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            setPublicationContent(markdown);
          });
        }}
      />
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
