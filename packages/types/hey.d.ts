import type {
  AmountInput,
  CollectOpenActionModuleType,
  RecipientDataInput
} from "@hey/lens";

export type StaffPick = {
  profileId: string;
};

export type Permission = {
  _count: { profiles: number };
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

export type PostViewCount = {
  id: string;
  views: number;
};

export type PostTip = {
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

export type AccountTheme = {
  fontStyle?: string;
};

export type MutedWord = {
  id: string;
  word: string;
  expiresAt: Date | null;
};

export type Preferences = {
  appIcon: number;
  email: null | string;
  emailVerified: boolean;
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  developerMode: boolean;
  permissions: string[];
  mutedWords: MutedWord[];
  theme: AccountTheme | null;
};

export type InternalAccount = Preferences;

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
