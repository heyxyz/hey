import getPostData from "@hey/helpers/getPostData";
import type { PostMetadataFragment } from "@hey/indexer";

const getPostOGImages = (metadata: PostMetadataFragment) => {
  const filteredAttachments = getPostData(metadata)?.attachments || [];
  const filteredAsset = getPostData(metadata)?.asset;

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

export default getPostOGImages;
