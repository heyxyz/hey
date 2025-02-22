import type { Maybe, MetadataLicenseType, PostMention } from "@hey/indexer";

export interface StorageNodeResponse {
  mimeType: string;
  uri: string;
}

export interface NewAttachment {
  file?: File;
  id?: string;
  mimeType: string;
  previewUri: string;
  type: "Audio" | "Image" | "Video";
  uri?: string;
}

export interface OG {
  description: null | string;
  favicon: null | string;
  html: null | string;
  image: null | string;
  lastIndexedAt?: string;
  site: null | string;
  title: null | string;
  url: string;
}

export interface Emoji {
  aliases: string[];
  category: string;
  description: string;
  emoji: string;
  tags: string[];
}

export interface OptimisticPublication {
  commentOn?: string;
  txHash: string;
}

export interface MarkupLinkProps {
  mentions?: PostMention[];
  title?: string;
}

export interface MetadataAsset {
  artist?: string;
  cover?: string;
  license?: Maybe<MetadataLicenseType>;
  title?: string;
  type: "Audio" | "Image" | "Video";
  uri: string;
}
