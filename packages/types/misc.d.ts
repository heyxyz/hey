import type { MediaSet } from '@hey/lens';

export interface MediaSetWithoutOnChain extends Omit<MediaSet, 'onChain'> {}

export interface NewAttachment extends MediaSetWithoutOnChain {
  id: string;
  file?: File;
  previewItem: string;
}

export interface UserSuggestion {
  uid: string;
  id: string;
  display: string;
  name: string;
  picture: string;
}

export interface OG {
  url: string;
  title: string | null;
  description: string | null;
  site: string | null;
  image: string | null;
  favicon: string | null;
  isLarge: boolean | null;
  html: string | null;
}

export interface ProfileInterest {
  category: { label: string; id: string };
  subCategories: { label: string; id: string }[];
}

export interface Emoji {
  emoji: string;
  description: string;
  category: string;
  aliases: string[];
  tags: string[];
}

export interface MessageDescriptor {
  id?: string;
  comment?: string;
  message?: string;
  context?: string;
  values?: Record<string, unknown>;
}

export interface OptimisticTransaction {
  txHash?: string;
  txId?: string;
  title?: string;
  cover?: string;
  author?: string;
  content: string;
  attachments: MediaSet[];
}

export interface MarkupLinkProps {
  href?: string;
  title?: string;
}
