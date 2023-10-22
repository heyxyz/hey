import type { Maybe, PublicationMetadataMedia } from '@hey/lens';

import replaceWithHeyIpfsGateway from './replaceWithHeyIpfsGateway';

const getAttachmentsData = (
  attachments?: Maybe<PublicationMetadataMedia[]>
): any => {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case 'PublicationMetadataMediaImage':
        return {
          uri: replaceWithHeyIpfsGateway(attachment.image.optimized?.uri),
          type: 'Image'
        };
      case 'PublicationMetadataMediaVideo':
        return {
          uri: replaceWithHeyIpfsGateway(attachment.video.optimized?.uri),
          type: 'Video'
        };
      case 'PublicationMetadataMediaAudio':
        return {
          uri: replaceWithHeyIpfsGateway(attachment.audio.optimized?.uri),
          type: 'Audio'
        };
      default:
        return [];
    }
  });
};

export default getAttachmentsData;
