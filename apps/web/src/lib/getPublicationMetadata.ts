import { article, audio, textOnly, video } from '@lens-protocol/metadata';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_VIDEO_TYPES,
  APP_NAME
} from '@lenster/data/constants';
import getUserLocale from '@lib/getUserLocale';
import { v4 as uuid } from 'uuid';

interface GetPublicationMetadataProps {
  baseMetadata: any;
  attachments: any[];
  cover: string;
}

const getPublicationMetadata = ({
  baseMetadata,
  attachments,
  cover
}: GetPublicationMetadataProps) => {
  const hasAttachments = attachments.length;
  const hasAudio = ALLOWED_AUDIO_TYPES.includes(
    attachments[0]?.original.mimeType
  );
  const hasVideo = ALLOWED_VIDEO_TYPES.includes(
    attachments[0]?.original.mimeType
  );

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
    case hasAttachments && !hasAudio && !hasVideo:
      return article({
        ...baseMetadata,
        ...localBaseMetadata,
        ...(hasAttachments && {
          attachments: attachments.map((attachment) => ({
            item: attachment.original.url,
            type: attachment.original.mimeType,
            cover: cover,
            altTag: attachment.original.altTag
          }))
        })
      });
    case hasAttachments && hasAudio:
    case hasAttachments && hasVideo:
      return video({
        ...baseMetadata,
        ...localBaseMetadata,
        audio: {
          item: attachments[0]?.original.url,
          type: attachments[0]?.original.mimeType
        }
      });
    default:
      return null;
  }
};

export default getPublicationMetadata;
