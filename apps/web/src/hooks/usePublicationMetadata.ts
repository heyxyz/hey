import { APP_NAME } from '@hey/data/constants';
import { audio, image, textOnly, video } from '@lens-protocol/metadata';
import getUserLocale from '@lib/getUserLocale';
import { useCallback } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { v4 as uuid } from 'uuid';

interface UsePublicationMetadataProps {
  baseMetadata: any;
}

const usePublicationMetadata = () => {
  const {
    attachments,
    audioPublication,
    videoThumbnail,
    videoDurationInSeconds
  } = usePublicationStore();

  const attachmentsHasAudio = attachments[0]?.type === 'Audio';
  const attachmentsHasVideo = attachments[0]?.type === 'Video';

  const cover = attachmentsHasAudio
    ? audioPublication.cover
    : attachmentsHasVideo
    ? videoThumbnail.url
    : attachments[0]?.uri;

  const getMetadata = useCallback(
    ({ baseMetadata }: UsePublicationMetadataProps) => {
      const hasAttachments = attachments.length;
      const hasImage = attachments[0]?.type === 'Image';
      const hasAudio = attachments[0]?.type === 'Audio';
      const hasVideo = attachments[0]?.type === 'Video';

      const localBaseMetadata = {
        id: uuid(),
        locale: getUserLocale(),
        appId: APP_NAME
      };

      switch (true) {
        case !hasAttachments:
          return textOnly({
            ...baseMetadata,
            ...localBaseMetadata
          });
        case hasImage:
          return image({
            ...baseMetadata,
            ...localBaseMetadata,
            image: {
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType
            },
            attachments: attachments.map((attachment) => ({
              item: attachment.uri,
              type: attachment.mimeType,
              cover: cover
            }))
          });
        case hasAudio:
          return audio({
            ...baseMetadata,
            ...localBaseMetadata,
            audio: {
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              artist: audioPublication.artist
            }
          });
        case hasVideo:
          return video({
            ...baseMetadata,
            ...localBaseMetadata,
            video: {
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              duration: parseInt(videoDurationInSeconds)
            }
          });
        default:
          return null;
      }
    },
    [attachments, videoDurationInSeconds, audioPublication, cover]
  );

  return getMetadata;
};

export default usePublicationMetadata;
