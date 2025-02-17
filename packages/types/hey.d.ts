import type { AmountInput } from "@hey/indexer";

export type StaffPick = {
  accountAddress: string;
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
  enabled?: boolean;
  amount?: AmountInput | null;
  recipients?: RecipientDataInput[];
  collectLimit?: null | number;
  followerOnly?: boolean;
  referralShare?: number;
  endsAt?: null | string;
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

export type MutedWord = {
  id: string;
  word: string;
  expiresAt: Date | null;
};

export type Preferences = {
  appIcon: number;
  hasDismissedOrMintedMembershipNft: boolean;
  includeLowScore: boolean;
  permissions: string[];
  mutedWords: MutedWord[];
};

export type InternalAccount = Preferences;

export type AccountDetails = {
  isSuspended: boolean;
  status: { emoji: string; message: string } | null;
};
