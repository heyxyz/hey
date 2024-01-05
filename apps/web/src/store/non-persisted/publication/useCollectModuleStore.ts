import type { CollectModuleType } from '@hey/types/hey';

import { create } from 'zustand';

const INITIAL_COLLECT_MODULE: CollectModuleType = {
  amount: null,
  collectLimit: null,
  endsAt: null,
  followerOnly: false,
  recipient: null,
  recipients: [],
  referralFee: 0,
  type: null
};

interface CollectModuleState {
  collectModule: CollectModuleType;
  reset: () => void;
  setCollectModule: (collectModule: CollectModuleType) => void;
}

export const useCollectModuleStore = create<CollectModuleState>((set) => ({
  collectModule: INITIAL_COLLECT_MODULE,
  reset: () => set(() => ({ collectModule: INITIAL_COLLECT_MODULE })),
  setCollectModule: (collectModule) => set(() => ({ collectModule }))
}));
