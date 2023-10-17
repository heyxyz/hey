import type { PublicationMetadata } from '@hey/lens';
import type { MetadataAsset } from '@hey/types/misc';

import getAttachmentsData from './getAttachmentsData';
import { knownNftMarketplace } from './nft/getNft';
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
      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.audio.optimized?.uri,
          cover: metadata.asset.cover?.optimized?.uri,
          artist: metadata.asset.artist,
          title: metadata.title,
          type: 'Audio'
        }
      };
    case 'VideoMetadataV3':
      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.video.optimized?.uri,
          cover: metadata.asset.cover?.optimized?.uri,
          type: 'Video'
        },
        attachments: getAttachmentsData(metadata.attachments)
      };
    case 'MintMetadataV3':
      return {
        content: removeUrlsByHostnames(metadata.content, knownNftMarketplace),
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
