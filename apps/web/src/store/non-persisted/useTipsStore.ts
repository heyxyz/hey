import type { TipsCount } from '@hey/types/hey';

import getPublicationsTips from '@hey/lib/getPublicationsTips';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  allowanceLeft: null | number;
  decreaseAllowance: (amount: number) => void;
  fetchAndStoreTips: (ids: string[]) => void;
  hasAllowance: () => boolean;
  publicationTips: TipsCount[];
  setAllowance: (allowance: null | number) => void;
}

const store = create<State>((set, get) => ({
  allowanceLeft: null,
  decreaseAllowance: (amount) => {
    const { allowanceLeft } = get();
    if (allowanceLeft) {
      set({ allowanceLeft: allowanceLeft - amount });
    }
  },
  fetchAndStoreTips: async (ids) => {
    if (!ids.length) {
      return;
    }

    const viewsResponse = await getPublicationsTips(ids);
    set((state) => ({
      publicationTips: [...state.publicationTips, ...viewsResponse]
    }));
  },
  hasAllowance: () => Boolean(get().allowanceLeft),
  publicationTips: [],
  setAllowance: (allowance) => set({ allowanceLeft: allowance })
}));

export const useTipsStore = createTrackedSelector(store);
