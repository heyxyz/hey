import type { PublicationViewCount } from '@hey/types/hey';

import getPublicationsTips from '@hey/lib/getPublicationsTips';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  allowanceLeft: number;
  allowanceResetsAt: Date;
  fetchAndStoreTips: (ids: string[]) => void;
  publicationTips: PublicationViewCount[];
  setAllowance: (allowance: number) => void;
  setAllowanceResetsAt: (allowanceResetsAt: Date) => void;
}

const store = create<State>((set) => ({
  allowanceLeft: 0,
  allowanceResetsAt: new Date(),
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
