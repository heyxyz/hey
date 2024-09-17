import type { CollectModuleType } from "@hey/types/hey";

import { create } from "zustand";

const INITIAL_COLLECT_MODULE: CollectModuleType = {
  amount: null,
  collectLimit: null,
  endsAt: null,
  followerOnly: false,
  recipients: [],
  referralFee: 0,
  type: null
};

interface State {
  collectModule: CollectModuleType;
  reset: () => void;
  setCollectModule: (collectModule: CollectModuleType) => void;
}

const store = create<State>((set) => ({
  collectModule: INITIAL_COLLECT_MODULE,
  reset: () => set(() => ({ collectModule: INITIAL_COLLECT_MODULE })),
  setCollectModule: (collectModule) => set(() => ({ collectModule }))
}));

export const useCollectModuleStore = store;
