import type { PublicationMetadata } from "@hey/lens";

import getPublicationData from "@hey/helpers/getPublicationData";

const getPublicationOGImages = (metadata: PublicationMetadata) => {
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const assetIsImage = filteredAsset?.type === "Image";
  const assetIsVideo = filteredAsset?.type === "Video";
  const assetIsAudio = filteredAsset?.type === "Audio";

  if (assetIsImage) {
    if (filteredAttachments.length > 0) {
      return filteredAttachments.map((attachment) => attachment.uri);
    }

    return [filteredAsset?.uri];
  }

  if (assetIsVideo) {
    if (filteredAttachments.length > 0) {
      return filteredAttachments.map((attachment) => attachment.uri);
    }

    return [filteredAsset?.cover];
  }

  if (assetIsAudio) {
    if (filteredAttachments.length > 0) {
      return filteredAttachments.map((attachment) => attachment.uri);
    }

    return [filteredAsset?.cover];
  }

  return [];
};

export default getPublicationOGImages;
