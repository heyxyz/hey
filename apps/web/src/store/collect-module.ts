import type { RecipientDataInput } from 'lens';
import { CollectModules } from 'lens';
import { create } from 'zustand';

export type CollectModuleType = {
  type?: CollectModules;
  amount?: { currency: string | null; value: string | null } | null;
  referralFee?: number | null;
  collectLimit?: string | null;
  timeLimit?: boolean;
  recipients?: RecipientDataInput[];
  followerOnlyCollect?: boolean;
};

const INITIAL_COLLECT_MODULE: CollectModuleType = {
  type: CollectModules.RevertCollectModule,
  amount: null,
  referralFee: 0,
  collectLimit: null,
  timeLimit: false,
  recipients: [],
  followerOnlyCollect: false
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
