import type { TipsCount } from '@hey/types/hey';

import getPublicationsTips from '@hey/lib/getPublicationsTips';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  allowanceLeft: null | number;
  allowanceResetsAt: Date | null;
  fetchAndStoreTips: (ids: string[]) => void;
  publicationTips: TipsCount[];
  setAllowance: (allowance: null | number) => void;
  setAllowanceResetsAt: (allowanceResetsAt: Date | null) => void;
}

const store = create<State>((set) => ({
  allowanceLeft: null,
  allowanceResetsAt: null,
  fetchAndStoreTips: async (ids) => {
    if (!ids.length) {
      return;
    }

    const viewsResponse = await getPublicationsTips(ids);
    set((state) => ({
      publicationTips: [...state.publicationTips, ...viewsResponse]
    }));
  },
  publicationTips: [],
  setAllowance: (allowance) => set({ allowanceLeft: allowance }),
  setAllowanceResetsAt: (allowanceResetsAt) => set({ allowanceResetsAt })
}));

export const useTipsStore = createTrackedSelector(store);
