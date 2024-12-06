import type { AccountMention, Maybe, MetadataLicenseType } from "@hey/indexer";
import type { OptmisticPostType } from "./enums";

export interface IPFSResponse {
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

export interface Nft {
  chain: null | string;
  collectionName: string;
  contractAddress: `0x${string}` | null;
  creatorAddress: `0x${string}`;
  description: string;
  endTime: null | string;
  mediaUrl: string;
  mintCount: null | string;
  mintStatus: "closed" | "live" | null | string;
  mintUrl: null | string;
  schema: "erc1155" | "erc721" | string;
  sourceUrl: string;
}

export type ButtonType = "link" | "mint" | "post_redirect" | "post" | "tx";
export type FrameTransaction = {
  chainId: string;
  method: string;
  params: {
    abi: string[];
    data: `0x${string}`;
    to: `0x${string}`;
    value: bigint;
  };
};

export interface Frame {
  acceptsAnonymous: boolean;
  acceptsLens: boolean;
  buttons: {
    action: ButtonType;
    button: string;
    postUrl?: string;
    target?: string;
  }[];
  frameUrl: string;
  image: string;
  imageAspectRatio: null | string;
  inputText: null | string;
  lensFramesVersion: null | string;
  location?: string;
  openFramesVersion: null | string;
  postUrl: string;
  state: null | string;
  transaction?: FrameTransaction;
}

export interface OG {
  description: null | string;
  favicon: null | string;
  frame: Frame | null;
  html: null | string;
  image: null | string;
  lastIndexedAt?: string;
  nft: Nft | null;
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
  blockOrUnblockOn?: string;
  collectOn?: string;
  commentOn?: string;
  content?: string;
  followOn?: string;
  repostOf?: string;
  txHash: string;
  type: OptmisticPostType;
  unfollowOn?: string;
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
