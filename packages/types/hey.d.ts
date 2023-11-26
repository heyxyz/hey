import type {
  AmountInput,
  CollectOpenActionModuleType,
  RecipientDataInput
} from '@hey/lens';

export type Group = {
  id: string;
  slug: string;
  name: string;
  description: string;
  avatar: string;
  tags: string[];
  lens: string | null;
  x: string | null;
  discord: string | null;
  instagram: string | null;
  featured: boolean;
  createdAt: Date;
};
export type StaffPick = {
  id: string;
  type: 'GROUP' | 'PROFILE';
  score: number;
  createdAt: Date;
};
export type Features = {
  id: string;
  key: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  createdAt: Date;
};
export type MembershipNft = {
  id: string;
  dismissedOrMinted: boolean;
  createdAt: Date;
};

export type CollectModuleType = {
  type?:
    | CollectOpenActionModuleType.SimpleCollectOpenActionModule
    | CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    | null;
  amount?: AmountInput | null;
  collectLimit?: string | null;
  referralFee?: number;
  recipient?: string | null;
  recipients?: RecipientDataInput[];
  followerOnly?: boolean;
  endsAt?: string | null;
};

export type PublicationViewCount = {
  id: string;
  views: number;
};

export type PollOption = {
  id: string;
  option: string;
  voted: boolean;
  percentage: number;
  responses: number;
};

export type Poll = {
  id: string;
  endsAt: Date;
  options: PollOption[];
};
