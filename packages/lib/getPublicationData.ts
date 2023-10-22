import type { PublicationMetadata } from '@hey/lens';
import type { MetadataAsset } from '@hey/types/misc';

import { knownEmbedHostnames } from './embeds/getEmbed';
import getAttachmentsData from './getAttachmentsData';
import { knownMintHostnames } from './nft/getNft';
import removeUrlsByHostnames from './removeUrlsByHostnames';
import replaceWithHeyIpfsGateway from './replaceWithHeyIpfsGateway';

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
          uri: replaceWithHeyIpfsGateway(metadata.asset.image.optimized?.uri),
          type: 'Image'
        },
        attachments: getAttachmentsData(metadata.attachments)
      };
    case 'AudioMetadataV3':
      return {
        content: metadata.content,
        asset: {
          uri: replaceWithHeyIpfsGateway(metadata.asset.audio.optimized?.uri),
          cover: replaceWithHeyIpfsGateway(
            metadata.asset.cover?.optimized?.uri
          ),
          artist: metadata.asset.artist,
          title: metadata.title,
          type: 'Audio'
        }
      };
    case 'VideoMetadataV3':
      return {
        content: metadata.content,
        asset: {
          uri: replaceWithHeyIpfsGateway(metadata.asset.video.optimized?.uri),
          cover: replaceWithHeyIpfsGateway(
            metadata.asset.cover?.optimized?.uri
          ),
          type: 'Video'
        },
        attachments: getAttachmentsData(metadata.attachments)
      };
    case 'MintMetadataV3':
      return {
        content: removeUrlsByHostnames(metadata.content, knownMintHostnames),
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
