import { APP_NAME } from '@hey/data/constants';
import type { NewAttachment } from '@hey/types/misc';
import { audio, image, textOnly, video } from '@lens-protocol/metadata';
import { v4 as uuid } from 'uuid';

import getUserLocale from '@/lib/getUserLocale';

interface GetPublicationMetadataProps {
  baseMetadata: any;
  attachments: NewAttachment[];
  cover: string;
}

const getPublicationMetadata = ({
  baseMetadata,
  attachments,
  cover
}: GetPublicationMetadataProps) => {
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
        audio: { item: attachments[0]?.uri, type: attachments[0]?.mimeType }
      });
    case hasVideo:
      return video({
        ...baseMetadata,
        ...localBaseMetadata,
        video: {
          item: attachments[0]?.uri,
          type: attachments[0]?.mimeType,
          duration: 0
        }
      });
    default:
      return null;
  }
};

export default getPublicationMetadata;
