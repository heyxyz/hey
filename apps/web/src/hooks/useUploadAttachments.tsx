import type { NewAttachment } from '@hey/types/misc';
import uploadToIPFS from '@lib/uploadToIPFS';
import { t } from '@lingui/macro';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';
import { v4 as uuid } from 'uuid';

const useUploadAttachments = () => {
  const addAttachments = usePublicationStore((state) => state.addAttachments);
  const updateAttachments = usePublicationStore(
    (state) => state.updateAttachments
  );
  const removeAttachments = usePublicationStore(
    (state) => state.removeAttachments
  );
  const setIsUploading = usePublicationStore((state) => state.setIsUploading);
  const setUploadedPercentage = usePublicationStore(
    (state) => state.setUploadedPercentage
  );

  const handleUploadAttachments = useCallback(
    async (attachments: any): Promise<NewAttachment[]> => {
      setIsUploading(true);
      const files = Array.from(attachments);
      const attachmentIds: string[] = [];

      const previewAttachments: NewAttachment[] = files.map((file: any) => {
        const attachmentId = uuid();
        attachmentIds.push(attachmentId);

        return {
          id: attachmentId,
          file: file,
          previewItem: URL.createObjectURL(file),
          original: {
            url: URL.createObjectURL(file),
            mimeType: file.type
          }
        };
      });

      const hasLargeAttachment = files.map((file: any) => {
        const isImage = file.type.includes('image');
        const isVideo = file.type.includes('video');
        const isAudio = file.type.includes('audio');

        if (isImage && file.size > 50000000) {
          toast.error(t`Image size should be less than 50MB`);
          return false;
        }

        if (isVideo && file.size > 500000000) {
          toast.error(t`Video size should be less than 500MB`);
          return false;
        }

        if (isAudio && file.size > 100000000) {
          toast.error(t`Audio size should be less than 100MB`);
          return false;
        }

        return true;
      });

      addAttachments(previewAttachments);
      let attachmentsIPFS: NewAttachment[] = [];
      try {
        if (hasLargeAttachment.includes(false)) {
          setIsUploading(false);
          removeAttachments(attachmentIds);
          return [];
        }

        const attachmentsUploaded = await uploadToIPFS(
          attachments,
          (percentCompleted) => setUploadedPercentage(percentCompleted)
        );
        if (attachmentsUploaded) {
          attachmentsIPFS = previewAttachments.map(
            (attachment: NewAttachment, index: number) => ({
              ...attachment,
              original: {
                url: attachmentsUploaded[index].original.url,
                mimeType: attachmentsUploaded[index].original.mimeType
              }
            })
          );
          updateAttachments(attachmentsIPFS);
        }
      } catch {
        removeAttachments(attachmentIds);
        toast.error(t`Something went wrong while uploading!`);
      }
      setIsUploading(false);

      return attachmentsIPFS;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addAttachments, removeAttachments, updateAttachments, setIsUploading]
  );

  return { handleUploadAttachments };
};

export default useUploadAttachments;
