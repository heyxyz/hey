import type { NewAttachment } from '@hey/types/misc';

import { APP_NAME } from '@hey/data/constants';
import { audio, image, textOnly, video } from '@lens-protocol/metadata';
import getUserLocale from '@lib/getUserLocale';
import { v4 as uuid } from 'uuid';

interface GetPublicationMetadataProps {
  attachments: NewAttachment[];
  baseMetadata: any;
  cover: string;
}

const getPublicationMetadata = ({
  attachments,
  baseMetadata,
  cover
}: GetPublicationMetadataProps) => {
  const hasAttachments = attachments.length;
  const hasImage = attachments[0]?.type === 'Image';
  const hasAudio = attachments[0]?.type === 'Audio';
  const hasVideo = attachments[0]?.type === 'Video';

  const localBaseMetadata = {
    appId: APP_NAME,
    id: uuid(),
    locale: getUserLocale()
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
        attachments: attachments.map((attachment) => ({
          cover: cover,
          item: attachment.uri,
          type: attachment.mimeType
        })),
        image: {
          item: attachments[0]?.uri,
          type: attachments[0]?.mimeType
        }
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
          duration: 0,
          item: attachments[0]?.uri,
          type: attachments[0]?.mimeType
        }
      });
    default:
      return null;
  }
};

export default getPublicationMetadata;
