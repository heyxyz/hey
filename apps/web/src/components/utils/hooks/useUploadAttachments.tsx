import type { NewLensterAttachment } from '@generated/types';
import uploadToIPFS from '@lib/uploadToIPFS';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';
import { v4 as uuid } from 'uuid';

const useUploadAttachments = () => {
  const addAttachments = usePublicationStore((state) => state.addAttachments);
  const updateAttachments = usePublicationStore((state) => state.updateAttachments);
  const removeAttachments = usePublicationStore((state) => state.removeAttachments);
  const setIsUploading = usePublicationStore((state) => state.setIsUploading);

  const handleUploadAttachments = useCallback(
    async (attachments: any): Promise<NewLensterAttachment[]> => {
      setIsUploading(true);
      const files = Array.from(attachments);
      const attachmentIds: string[] = [];
      const previewAttachments: NewLensterAttachment[] = files.map((file: any) => {
        const attachmentId = uuid();
        attachmentIds.push(attachmentId);

        return {
          id: attachmentId,
          type: file.type,
          altTag: '',
          previewItem: URL.createObjectURL(file)
        };
      });
      addAttachments(previewAttachments);
      let attachmentsIPFS: NewLensterAttachment[] = [];
      try {
        const attachmentsUploaded = await uploadToIPFS(attachments);
        if (attachmentsUploaded) {
          attachmentsIPFS = previewAttachments.map((attachment: NewLensterAttachment, index: number) => ({
            ...attachment,
            item: attachmentsUploaded[index].item
          }));
          updateAttachments(attachmentsIPFS);
        }
      } catch {
        removeAttachments(attachmentIds);
        toast.error('Something went wrong while uploading!');
      }
      setIsUploading(false);

      return attachmentsIPFS;
    },
    [addAttachments, removeAttachments, updateAttachments, setIsUploading]
  );

  return { handleUploadAttachments };
};

export default useUploadAttachments;
