import { PLACEHOLDER_IMAGE } from '@hey/data/constants';
import type { PublicationMetadata } from '@hey/lens';
import type { MetadataAsset } from '@hey/types/misc';

import { knownEmbedHostnames } from './embeds/getEmbed';
import getAttachmentsData from './getAttachmentsData';
import removeUrlsByHostnames from './removeUrlsByHostnames';

const getPublicationData = (
  metadata: PublicationMetadata
): {
  content?: string;
  asset?: MetadataAsset;
  attachments?: {
    uri: string;
    type: 'Image' | 'Video' | 'Audio';
  }[];
} | null => {
  switch (metadata.__typename) {
    case 'ArticleMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      };
    case 'TextOnlyMetadataV3':
    case 'LinkMetadataV3':
      return {
        content: metadata.content
      };
    case 'ImageMetadataV3':
      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.image.optimized?.uri,
          type: 'Image'
        },
        attachments: getAttachmentsData(metadata.attachments)
      };
    case 'AudioMetadataV3':
      const audioAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.audio.optimized?.uri || audioAttachments?.uri,
          cover:
            metadata.asset.cover?.optimized?.uri ||
            audioAttachments?.coverUri ||
            PLACEHOLDER_IMAGE,
          artist: metadata.asset.artist || audioAttachments?.artist,
          title: metadata.title,
          type: 'Audio'
        }
      };
    case 'VideoMetadataV3':
      const videoAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.video.optimized?.uri || videoAttachments?.uri,
          cover:
            metadata.asset.cover?.optimized?.uri ||
            videoAttachments?.coverUri ||
            PLACEHOLDER_IMAGE,
          type: 'Video'
        }
      };
    case 'MintMetadataV3':
      return {
        content: removeUrlsByHostnames(
          metadata.content,
          new Set(['basepaint.art', 'unlonely.app'])
        ),
        attachments: getAttachmentsData(metadata.attachments)
      };
    case 'EmbedMetadataV3':
      return {
        content: removeUrlsByHostnames(metadata.content, knownEmbedHostnames),
        attachments: getAttachmentsData(metadata.attachments)
      };
    case 'LiveStreamMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      };
    default:
      return null;
  }
};

export default getPublicationData;
