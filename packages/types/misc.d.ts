import type { Maybe, PublicationMetadataLicenseType } from '@hey/lens';

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
  collectionName: null | string;
  contractAddress: null | string;
  creatorAddress: null | string;
  endTime: null | string;
  mediaUrl: null | string;
  mintCount: null | number;
  mintStatus: 'closed' | 'live' | null | string;
  mintUrl: null | string;
  schema: 'erc1155' | 'erc721' | null | string;
  sourceUrl: string;
}

export interface OG {
  description: null | string;
  favicon: null | string;
  html: null | string;
  image: null | string;
  isLarge: boolean | null;
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

export interface MessageDescriptor {
  comment?: string;
  context?: string;
  id?: string;
  message?: string;
  values?: Record<string, unknown>;
}

export interface OptimisticTransaction {
  commentOn?: string;
  content: string;
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
  license?: Maybe<PublicationMetadataLicenseType>;
  title?: string;
  type: 'Audio' | 'Image' | 'Video';
  uri: string;
}
