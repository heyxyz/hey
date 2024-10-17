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

export type Preferences = {
  appIcon: number;
  email: null | string;
  emailVerified: boolean;
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  permissions: string[];
};

export type InternalProfile = Preferences;

export type ProfileTheme = {
  overviewFontStyle?: string;
  publicationFontStyle?: string;
};

export type ProfileDetails = {
  isSuspended: boolean;
  status: { emoji: string; message: string } | null;
  theme: ProfileTheme | null;
};

export type Moderation = {
  id: string;
  flagged: boolean;
  harassment: boolean;
  harassment_threatening: boolean;
  sexual: boolean;
  hate: boolean;
  hate_threatening: boolean;
  illicit: boolean;
  illicit_violent: boolean;
  self_harm_intent: boolean;
  self_harm_instructions: boolean;
  self_harm: boolean;
  sexual_minors: boolean;
  violence: boolean;
  violence_graphic: boolean;
  harassment_score: number;
  harassment_threatening_score: number;
  sexual_score: number;
  hate_score: number;
  hate_threatening_score: number;
  illicit_score: number;
  illicit_violent_score: number;
  self_harm_intent_score: number;
  self_harm_instructions_score: number;
  self_harm_score: number;
  sexual_minors_score: number;
  violence_score: number;
  violence_graphic_score: number;
};
