import type {
  AmountInput,
  CollectOpenActionModuleType,
  RecipientDataInput
} from '@hey/lens';

export type Group = {
  avatar: string;
  createdAt: Date;
  creatorId: string;
  description: string;
  discord: null | string;
  featured: boolean;
  hasFavorited: boolean;
  id: string;
  instagram: null | string;
  isMember: boolean;
  lens: null | string;
  members: number;
  name: string;
  slug: string;
  tags: string[];
  x: null | string;
};

export type StaffPick = {
  createdAt: Date;
  id: string;
};

export type Feature = {
  createdAt: Date;
  enabled: boolean;
  id: string;
  key: string;
  priority: number;
  type: 'FEATURE' | 'MODE' | 'PERMISSION';
};

export type AllowedToken = {
  contractAddress: string;
  decimals: number;
  id: string;
  name: string;
  symbol: string;
};

export type MembershipNft = {
  createdAt: Date;
  dismissedOrMinted: boolean;
  id: string;
};

export type CollectModuleType = {
  amount?: AmountInput | null;
  collectLimit?: null | string;
  endsAt?: null | string;
  followerOnly?: boolean;
  recipient?: null | string;
  recipients?: RecipientDataInput[];
  referralFee?: number;
  type?:
    | CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    | CollectOpenActionModuleType.SimpleCollectOpenActionModule
    | null;
};

export type PublicationViewCount = {
  id: string;
  views: number;
};

export type PollOption = {
  id: string;
  option: string;
  percentage: number;
  responses: number;
  voted: boolean;
};

export type Poll = {
  endsAt: Date;
  id: string;
  options: PollOption[];
};

export type Preferences = {
  features: string[];
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  isPride: boolean;
};
