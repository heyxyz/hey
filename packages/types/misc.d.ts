import type { AccountMention, Maybe, MetadataLicenseType } from "@hey/indexer";
import type { OptmisticTransactionType } from "./enums";

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

export interface ProfileInterest {
  category: { id: string; label: string };
  subCategories: { id: string; label: string }[];
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
  content?: string;
  txHash: string;
  type: OptmisticTransactionType;
}

export interface MarkupLinkProps {
  mentions?: AccountMention[];
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
