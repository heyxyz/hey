import type { CollectModuleType } from '@hey/types/hey';
import { create } from 'zustand';

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
