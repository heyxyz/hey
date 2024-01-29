import type { PublicationMetadata } from '@hey/lens';
import type { MetadataAsset } from '@hey/types/misc';

import { PLACEHOLDER_IMAGE } from '@hey/data/constants';

import getAttachmentsData from './getAttachmentsData';

const getPublicationData = (
  metadata: PublicationMetadata
): {
  asset?: MetadataAsset;
  attachments?: {
    type: 'Audio' | 'Image' | 'Video';
    uri: string;
  }[];
  content?: string;
} | null => {
  switch (metadata.__typename) {
    case 'ArticleMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      };
    case 'TextOnlyMetadataV3':
    case 'LinkMetadataV3':
      return {
        content: metadata.content
      };
    case 'ImageMetadataV3':
      return {
        asset: {
          type: 'Image',
          uri: metadata.asset.image.optimized?.uri
        },
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      };
    case 'AudioMetadataV3': {
      const audioAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          artist: metadata.asset.artist || audioAttachments?.artist,
          cover:
            metadata.asset.cover?.optimized?.uri ||
            audioAttachments?.coverUri ||
            PLACEHOLDER_IMAGE,
          license: metadata.asset.license,
          title: metadata.title,
          type: 'Audio',
          uri: metadata.asset.audio.optimized?.uri || audioAttachments?.uri
        },
        content: metadata.content
      };
    }
    case 'VideoMetadataV3': {
      const videoAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          cover:
            metadata.asset.cover?.optimized?.uri ||
            videoAttachments?.coverUri ||
            PLACEHOLDER_IMAGE,
          license: metadata.asset.license,
          type: 'Video',
          uri: metadata.asset.video.optimized?.uri || videoAttachments?.uri
        },
        content: metadata.content
      };
    }
    case 'MintMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      };
    case 'LiveStreamMetadataV3':
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      };
    default:
      return null;
  }
};

export default getPublicationData;
