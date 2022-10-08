import { CollectModules } from '@generated/types';
import { DEFAULT_COLLECT_TOKEN } from 'src/constants';
import create from 'zustand';

interface CollectModuleState {
  selectedCollectModule: CollectModules;
  setSelectedCollectModule: (selectedModule: CollectModules) => void;
  amount: null | string;
  setAmount: (amount: null | string) => void;
  selectedCurrency: null | string;
  setSelectedCurrency: (selectedCurrency: null | string) => void;
  referralFee: null | string;
  setReferralFee: (referralFee: null | string) => void;
  collectLimit: null | string;
  setCollectLimit: (collectLimit: null | string) => void;
  hasTimeLimit: boolean;
  setHasTimeLimit: (hasTimeLimit: boolean) => void;
  payload: any;
  setPayload: (payload: any) => void;
  reset: () => void;
}

export const useCollectModuleStore = create<CollectModuleState>((set) => ({
  selectedCollectModule: CollectModules.FreeCollectModule,
  setSelectedCollectModule: (selectedCollectModule) => set(() => ({ selectedCollectModule })),
  amount: null,
  setAmount: (amount) => set(() => ({ amount })),
  selectedCurrency: DEFAULT_COLLECT_TOKEN,
  setSelectedCurrency: (selectedCurrency) => set(() => ({ selectedCurrency })),
  referralFee: null,
  setReferralFee: (referralFee) => set(() => ({ referralFee })),
  collectLimit: null,
  setCollectLimit: (collectLimit) => set(() => ({ collectLimit })),
  hasTimeLimit: false,
  setHasTimeLimit: (hasTimeLimit) => set(() => ({ hasTimeLimit })),
  payload: { freeCollectModule: { followerOnly: false } },
  setPayload: (payload) => set(() => ({ payload })),
  reset: () =>
    set(() => ({
      selectedCollectModule: CollectModules.FreeCollectModule,
      amount: null,
      selectedCurrency: DEFAULT_COLLECT_TOKEN,
      referralFee: null,
      collectLimit: null,
      hasTimeLimit: false,
      payload: { freeCollectModule: { followerOnly: false } }
    }))
}));
