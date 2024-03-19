import type { Maybe } from '@hey/lens';
import type { MetadataLicenseType } from '@lens-protocol/metadata';

import type { OptmisticPublicationType } from './enums';

export interface IPFSResponse {
  mimeType: string;
  uri: string;
}

export interface NewAttachment {
  file?: File;
  id?: string;
  mimeType: string;
  previewUri: string;
  type: 'Audio' | 'Image' | 'Video';
  uri?: string;
}

export interface UserSuggestion {
  display: string;
  id: string;
  name: string;
  picture: string;
  uid: string;
}

export interface Nft {
  chain: null | string;
  collectionName: string;
  contractAddress: `0x${string}`;
  creatorAddress: `0x${string}`;
  endTime: null | string;
  mediaUrl: string;
  mintCount: null | string;
  mintStatus: 'closed' | 'live' | null | string;
  mintUrl: null | string;
  schema: 'erc1155' | 'erc721' | string;
  sourceUrl: string;
}

export type ButtonType = 'link' | 'mint' | 'post_redirect' | 'post';

export interface Portal {
  buttons: {
    action: ButtonType;
    button: string;
    target?: string;
  }[];
  image: string;
  portalUrl: string;
  postUrl: string;
  version: string;
}

export interface OG {
  description: null | string;
  favicon: null | string;
  html: null | string;
  image: null | string;
  isLarge: boolean | null;
  lastIndexedAt?: string;
  nft: Nft | null;
  portal: null | Portal;
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

export interface MessageDescriptor {
  comment?: string;
  context?: string;
  id?: string;
  message?: string;
  values?: Record<string, unknown>;
}

export interface OptimisticTransaction {
  collectOn?: string;
  commentOn?: string;
  content?: string;
  txHash?: string;
  txId?: string;
  type: OptmisticPublicationType;
}

export interface MarkupLinkProps {
  mentions?: ProfileMentioned[];
  title?: string;
}

export interface MetadataAsset {
  artist?: string;
  cover?: string;
  license?: Maybe<MetadataLicenseType>;
  title?: string;
  type: 'Audio' | 'Image' | 'Video';
  uri: string;
}
