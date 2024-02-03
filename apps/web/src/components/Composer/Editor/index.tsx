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
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { EditorContent, useCurrentEditor, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';


const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS];

const Editor: FC = () => {
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );
  const showPollEditor = usePublicationPollStore(
    (state) => state.showPollEditor
  );
  const attachments = usePublicationAttachmentStore(
    (state) => state.attachments
  );
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


  const tiptapeditor = useEditor({
    editorProps: {
      attributes: {
        class: 'my-4 block min-h-[65px] overflow-auto px-5 leading-6 sm:leading-[26px] focus:outline-none',
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        showOnlyWhenEditable: true,
        placeholder: () => showPollEditor ? 'Ask a question...' : "What's happening?",
        emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:absolute  before:whitespace-nowrap  before:text-gray-400  before-pointer-events-none',
      }),
    ],
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
    }
  })

  if (tiptapeditor === null) {
    return
  }

  return (
    <div className="relative">
      <ToolbarPlugin tiptapeditor={tiptapeditor} />
      <EditorContent  editor={tiptapeditor} />
    </div>
  );
};

export default Editor;

