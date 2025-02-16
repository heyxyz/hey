import type { Maybe, MetadataLicenseType, PostMention } from "@hey/indexer";
import type { OptimisticTxType } from "./enums";

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

export interface OptimisticTransaction {
  blockOn?: string;
  unblockOn?: string;
  collectOn?: string;
  commentOn?: string;
  repostOf?: string;
  followOn?: string;
  unfollowOn?: string;
  joinOn?: string;
  leaveOn?: string;
  banOn?: string;
  content?: string;
  txHash: string;
  type: OptimisticTxType;
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
