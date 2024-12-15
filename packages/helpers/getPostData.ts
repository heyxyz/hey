import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type { PostMetadata } from "@hey/indexer";
import type { MetadataAsset } from "@hey/types/misc";
import getAttachmentsData from "./getAttachmentsData";

const getPostData = (
  metadata: PostMetadata
): {
  asset?: MetadataAsset;
  attachments?: {
    type: "Audio" | "Image" | "Video";
    uri: string;
  }[];
  content?: string;
} | null => {
  const { content } = metadata;

  switch (metadata.__typename) {
    case "ArticleMetadata":
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content
      };
    case "TextOnlyMetadata":
    case "LinkMetadata":
      return { content };
    case "ImageMetadata":
      return {
        asset: {
          type: "Image",
          uri: metadata.image.item
        },
        attachments: getAttachmentsData(metadata.attachments),
        content
      };
    case "AudioMetadata": {
      const audioAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          artist: metadata.audio.artist || audioAttachments?.artist,
          cover:
            metadata.audio.cover ||
            audioAttachments?.coverUri ||
            PLACEHOLDER_IMAGE,
          license: metadata.audio.license,
          title: metadata.title || "Untitled",
          type: "Audio",
          uri: metadata.audio.item || audioAttachments?.uri
        },
        content
      };
    }
    case "VideoMetadata": {
      const videoAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          cover: metadata.video.cover || videoAttachments?.coverUri,
          // TODO: Fix this type
          license: metadata.video.license as any,
          type: "Video",
          uri: metadata.video.item || videoAttachments?.uri
        },
        content
      };
    }
    case "MintMetadata":
    case "LivestreamMetadata":
    case "CheckingInMetadata":
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content
      };
    default:
      return null;
  }
};

export default getPostData;
