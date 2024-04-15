import type { ClipboardEvent } from 'react';

import { MediaImageMimeType } from '@lens-protocol/metadata';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import {
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_NORMAL,
  PASTE_COMMAND
} from 'lexical';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';

const ImageMimeType: MediaImageMimeType[] = Object.values(MediaImageMimeType);

const ImagesPlugin = (): JSX.Element | null => {
  const { attachments } = usePublicationAttachmentStore((state) => state);
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
    const command = (files: File[]) => {
      // Filter files to include only those with MIME types that appear in ImageMimeType
      const imageFiles = files.filter((file) =>
        ImageMimeType.includes(file.type as MediaImageMimeType)
      );

      // Only proceed if there are image files
      if (imageFiles.length > 0) {
        const filesResult = imageFiles as unknown as FileList;
        handlePaste(filesResult);

        return true;
      }

      toast.error('Only images are allowed right now.');
      return false;
    };

    // Register the command with the editor
    const unregister = editor.registerCommand(
      DRAG_DROP_PASTE,
      command,
      COMMAND_PRIORITY_LOW
    );

    // Cleanup function to unregister the command when the component unmounts or editor changes
    return () => {
      unregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<ClipboardEvent & InputEvent>(
        PASTE_COMMAND,
        (event) => {
          if (event) {
            const { clipboardData, dataTransfer } = event;

            // If the clipboard data contains text, we don't want to handle the image paste event.
            if (clipboardData?.getData('Text')) {
              return false;
            }

            // If the clipboard data contains files, we want to handle the image paste event.
            if (dataTransfer?.files.length) {
              const { files } = dataTransfer;
              handlePaste(files);
            }

            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_NORMAL
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return null;
};

export default ImagesPlugin;
