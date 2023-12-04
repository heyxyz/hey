import type { Maybe, PublicationMetadataMedia } from '@hey/lens';

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
          type: 'Image',
          uri: attachment.image.optimized?.uri
        };
      case 'PublicationMetadataMediaVideo':
        return {
          coverUri: attachment.cover?.optimized?.uri,
          type: 'Video',
          uri: attachment.video.optimized?.uri
        };
      case 'PublicationMetadataMediaAudio':
        return {
          artist: attachment.artist,
          coverUri: attachment.cover?.optimized?.uri,
          type: 'Audio',
          uri: attachment.audio.optimized?.uri
        };
      default:
        return [];
    }
  });
};

export default getAttachmentsData;
