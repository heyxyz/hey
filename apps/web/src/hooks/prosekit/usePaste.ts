import type { EditorExtension } from "@helpers/prosekit/extension";

import { type Editor, defineDOMEventHandler, union } from "prosekit/core";
import { useExtension } from "prosekit/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import useUploadAttachments from "src/hooks/useUploadAttachments";
import { usePublicationAttachmentStore } from "src/store/non-persisted/publication/usePublicationAttachmentStore";

/**
 * Define a ProseKit extension for handling drop and paste events.
 */
const definePasteDropExtension = (onPaste: (files: FileList) => void) => {
  const handleFiles = (event: Event, files: FileList | null | undefined) => {
    if (files?.length) {
      event.preventDefault();
      onPaste(files);
      return true;
    }
    return false;
  };

  const dropExtension = defineDOMEventHandler(
    "drop",
    (_view, event): boolean => {
      return handleFiles(event, event?.dataTransfer?.files);
    }
  );

  const pasteExtension = defineDOMEventHandler(
    "paste",
    (_view, event): boolean => {
      // If the clipboard data contains text, we don't want to handle the image paste event.
      if (event?.clipboardData?.getData("Text")) {
        return false;
      }

      return handleFiles(event, event?.clipboardData?.files);
    }
  );

  return union([dropExtension, pasteExtension]);
};

export const usePaste = (editor: Editor<EditorExtension>) => {
  const { attachments } = usePublicationAttachmentStore((state) => state);
  const { handleUploadAttachments } = useUploadAttachments();

  const handlePaste = useCallback(
    async (pastedFiles: FileList) => {
      if (
        attachments.length === 4 ||
        attachments.length + pastedFiles.length > 4
      ) {
        return toast.error("Please choose either 1 video or up to 4 photos.");
      }

      if (pastedFiles) {
        await handleUploadAttachments(pastedFiles);
      }
    },
    [handleUploadAttachments, attachments.length]
  );

  const handlePasteRef = useRef(handlePaste);

  useEffect(() => {
    handlePasteRef.current = handlePaste;
  }, [handlePaste]);

  const extension = useMemo(() => {
    return definePasteDropExtension(
      // Use React ref to avoid the value of extension changing on re-render, as
      // removing and re-adding the extension could be expensive.
      (files) => handlePasteRef.current(files)
    );
  }, []);

  useExtension(extension, { editor });
};
