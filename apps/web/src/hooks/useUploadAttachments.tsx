import type { NewAttachment } from '@hey/types/misc';

import imageCompression from 'browser-image-compression';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import uploadToIPFS from 'src/helpers/uploadToIPFS';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationVideoStore } from 'src/store/non-persisted/publication/usePublicationVideoStore';
import { v4 as uuid } from 'uuid';

const useUploadAttachments = () => {
  const { setUploadedPercentage } = usePublicationVideoStore();
  const {
    addAttachments,
    removeAttachments,
    setIsUploading,
    updateAttachments
  } = usePublicationAttachmentStore((state) => state);

  const validateFileSize = (file: any) => {
    const isImage = file.type.includes('image');
    const isVideo = file.type.includes('video');
    const isAudio = file.type.includes('audio');

    if (isImage && file.size > 50000000) {
      toast.error('Image size should be less than 50MB');
      return false;
    }

    if (isVideo && file.size > 500000000) {
      toast.error('Video size should be less than 500MB');
      return false;
    }

    if (isAudio && file.size > 200000000) {
      toast.error('Audio size should be less than 200MB');
      return false;
    }

    return true;
  };

  const handleUploadAttachments = useCallback(
    async (attachments: any): Promise<NewAttachment[]> => {
      setIsUploading(true);

      const files = Array.from(attachments);
      const attachmentIds: string[] = [];

      const compressedFiles = await Promise.all(
        files.map(async (file: any) => {
          if (file.type.includes('image') && !file.type.includes('gif')) {
            return await imageCompression(file, {
              exifOrientation: 1,
              maxSizeMB: 2,
              maxWidthOrHeight: 4096,
              useWebWorker: true
            });
          }

          return file;
        })
      );

      const previewAttachments: NewAttachment[] = compressedFiles.map(
        (file: any) => {
          const attachmentId = uuid();
          attachmentIds.push(attachmentId);

          return {
            file,
            id: attachmentId,
            mimeType: file.type,
            previewUri: URL.createObjectURL(file),
            type: file.type.includes('image')
              ? 'Image'
              : file.type.includes('video')
                ? 'Video'
                : 'Audio'
          };
        }
      );

      if (compressedFiles.some((file) => validateFileSize(file))) {
        addAttachments(previewAttachments);

        try {
          const attachmentsUploaded = await uploadToIPFS(
            compressedFiles,
            setUploadedPercentage
          );
          const attachmentsIPFS = attachmentsUploaded.map(
            (uploaded, index) => ({
              ...previewAttachments[index],
              mimeType: uploaded.mimeType,
              uri: uploaded.uri
            })
          );

          updateAttachments(attachmentsIPFS);
          setIsUploading(false);

          return attachmentsIPFS;
        } catch {
          toast.error('Something went wrong while uploading!');
          removeAttachments(attachmentIds);
        }
      } else {
        removeAttachments(attachmentIds);
      }

      setIsUploading(false);
      return [];
    },
    [
      addAttachments,
      removeAttachments,
      updateAttachments,
      setIsUploading,
      setUploadedPercentage
    ]
  );

  return { handleUploadAttachments };
};

export default useUploadAttachments;
