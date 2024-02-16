import type { Editor as IEditor } from '@tiptap/react';

import { EmojiPickerPlugin } from '@components/Shared/TipTap/Extensions/Emoji';
import { Hashtag } from '@components/Shared/TipTap/Extensions/Hashtag';
import Images from '@components/Shared/TipTap/Extensions/Images';
import { DisplayMention } from '@components/Shared/TipTap/Extensions/Mention';
import ToolbarPlugin from '@components/Shared/TipTap/Extensions/Toolbar';
import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { History } from '@tiptap/extension-history';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Text } from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { type FC, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import TurndownService from 'turndown';

/* 
 When using TipTap's <ContextProvider/> it results in broken out of order UI components 
 and layout shifts so we use a global value 
*/
declare global {
  interface Window {
    editor?: IEditor;
  }
}

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

  const turndown = new TurndownService();

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

  const editor = useEditor({
    content: '',
    editorProps: {
      attributes: {
        class:
          'my-4 block min-h-[65px] overflow-auto px-5 leading-6 sm:leading-[26px] focus:outline-none'
      }
    },
    extensions: [
      History,
      Bold,
      Code,
      Italic,
      CodeBlock,
      HardBreak,
      Heading,
      Paragraph,
      Text,
      DisplayMention,
      EmojiPickerPlugin,
      Document,
      Hashtag,
      Link.configure({
        autolink: true,
        openOnClick: false
      }),
      Images({ onPaste: handlePaste }),
      Placeholder.configure({
        emptyEditorClass:
          'cursor-text before:content-[attr(data-placeholder)] before:absolute  before:whitespace-nowrap  before:text-gray-400  before-pointer-events-none',
        placeholder: () =>
          showPollEditor ? 'Ask a question...' : "What's happening?",
        showOnlyWhenEditable: true
      })
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdownOutput = turndown.turndown(html);
      setPublicationContent(markdownOutput);
    }
  });

  useEffect(() => {
    if (!window.editor) {
      window.editor = editor!;
    }
    return () => {
      window.editor = undefined;
    };
  }, [editor]);

  if (editor === null) {
    return;
  }
  return (
    <div className="relative">
      <ToolbarPlugin editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
