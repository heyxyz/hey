import { article, audio, textOnly, video } from '@lens-protocol/metadata';
import { APP_NAME } from '@lenster/data/constants';
import type { NewLensterAttachment } from '@lenster/types/misc';
import getUserLocale from '@lib/getUserLocale';
import { v4 as uuid } from 'uuid';

interface GetPublicationMetadataProps {
  baseMetadata: any;
  attachments: NewLensterAttachment[];
  cover: string;
}

const getPublicationMetadata = ({
  baseMetadata,
  attachments,
  cover
}: GetPublicationMetadataProps) => {
  const hasAttachments = attachments.length;
  const hasAudio =
    attachments[0]?.__typename === 'PublicationMetadataMediaAudio';
  const hasVideo =
    attachments[0]?.__typename === 'PublicationMetadataMediaVideo';

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
            item: attachment.uploaded.uri,
            type: attachment.uploaded.mimeType,
            cover: cover
          }))
        })
      });
    case hasAttachments && hasAudio:
      return audio({
        ...baseMetadata,
        ...localBaseMetadata,
        audio: {
          item: attachments[0]?.uploaded.uri,
          type: attachments[0]?.uploaded.mimeType
        }
      });
    case hasAttachments && hasVideo:
      return video({
        ...baseMetadata,
        ...localBaseMetadata,
        video: {
          item: attachments[0]?.uploaded.uri,
          type: attachments[0]?.uploaded.mimeType
        }
      });
    default:
      return null;
  }
};

export default getPublicationMetadata;
