import type {
  AmountInput,
  CollectOpenActionModuleType,
  RecipientDataInput
} from "@hey/lens";

export type StaffPick = {
  profileId: string;
};

export type Permission = {
  _count: {
    profiles: number;
  };
  createdAt: Date;
  id: string;
  key: string;
  type: "COHORT" | "PERMISSION";
};

export type AllowedToken = {
  contractAddress: string;
  decimals: number;
  id: string;
  name: string;
  symbol: string;
};

export type CollectModuleType = {
  amount?: AmountInput | null;
  collectLimit?: null | string;
  endsAt?: null | string;
  followerOnly?: boolean;
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

export type PublicationTip = {
  count: number;
  id: string;
  tipped: boolean;
};

type PollOption = {
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

export type ProfileTheme = {
  fontStyle?: string;
};

export type Preferences = {
  appIcon: number;
  email: null | string;
  emailVerified: boolean;
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  permissions: string[];
  theme: ProfileTheme | null;
};

export type InternalProfile = Preferences;

export type ProfileDetails = {
  isSuspended: boolean;
  status: { emoji: string; message: string } | null;
};

export type List = {
  id: string;
  name: string;
  description: string | null;
  avatar: string | null;
  totalProfiles: number;
  totalPins: number;
  createdBy: string;
  isAdded?: boolean;
  pinned?: boolean;
  profiles?: string[];
};
