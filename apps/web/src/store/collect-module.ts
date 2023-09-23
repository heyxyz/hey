import type {
  AmountInput,
  CollectOpenActionModuleType,
  RecipientDataInput
} from '@lenster/lens';
import { create } from 'zustand';

export type CollectModuleType = {
  type:
    | CollectOpenActionModuleType.SimpleCollectOpenActionModule
    | CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule
    | null;
  amount?: AmountInput | null;
  collectLimit?: string | null;
  referralFee?: number | null;
  recipient?: string | null;
  recipients?: RecipientDataInput[];
  followerOnly?: boolean;
  endsAt?: string | null;
};

const INITIAL_COLLECT_MODULE: CollectModuleType = {
  type: null,
  amount: null,
  collectLimit: null,
  referralFee: 0,
  recipient: null,
  recipients: [],
  followerOnly: false,
  endsAt: null
};

interface CollectModuleState {
  collectModule: CollectModuleType;
  setCollectModule: (collectModule: CollectModuleType) => void;
  reset: () => void;
}

export const useCollectModuleStore = create<CollectModuleState>((set) => ({
  collectModule: INITIAL_COLLECT_MODULE,
  setCollectModule: (collectModule) => set(() => ({ collectModule })),
  reset: () => set(() => ({ collectModule: INITIAL_COLLECT_MODULE }))
}));
