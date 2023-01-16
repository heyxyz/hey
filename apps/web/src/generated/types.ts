import type { FeeFollowModuleSettings, ProfileFollowModuleSettings, RevertFollowModuleSettings } from 'lens';

export type LensterFollowModule = FeeFollowModuleSettings &
  ProfileFollowModuleSettings &
  RevertFollowModuleSettings;

export interface LensterAttachment {
  item: string;
  type: string;
  altTag: string;
}

export interface NewLensterAttachment extends Omit<LensterAttachment, 'item'> {
  id: string;
  item?: string;
  previewItem?: string;
}

export interface UserSuggestion {
  uid: string;
  id: string;
  display: string;
  name: string;
  picture: string;
}

export interface OG {
  title: string;
  description: string;
  site: string;
  url: string;
  favicon: string;
  thumbnail: string;
  isSquare: boolean;
  html: string;
}

export interface ProfileInterest {
  category: { label: string; id: string };
  subCategories: { label: string; id: string }[];
}
