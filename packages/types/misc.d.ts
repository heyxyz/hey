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
  uri: string;
}

export interface UserSuggestion {
  display: string;
  id: string;
  name: string;
  picture: string;
  uid: string;
}

export interface OG {
  description: null | string;
  favicon: null | string;
  html: null | string;
  image: null | string;
  isLarge: boolean | null;
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
