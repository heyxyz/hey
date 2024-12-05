import type { AnyMedia, Maybe } from "@hey/indexer";

const getAttachmentsData = (attachments?: Maybe<AnyMedia[]>): any => {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case "MediaImage":
        return {
          type: "Image",
          uri: attachment.item
        };
      case "MediaVideo":
        return {
          coverUri: attachment.cover,
          type: "Video",
          uri: attachment.item
        };
      case "MediaAudio":
        return {
          artist: attachment.artist,
          coverUri: attachment.cover,
          type: "Audio",
          uri: attachment.item
        };
      default:
        return [];
    }
  });
};

export default getAttachmentsData;
