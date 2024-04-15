import type { TipsCount } from '@hey/types/hey';

import getPublicationsTips from '@hey/lib/getPublicationsTips';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  addOrUpdatePublicationTip: ({
    amount,
    publicationId
  }: {
    amount: number;
    publicationId: string;
  }) => void;
  allowanceLeft: null | number;
  allowanceResetsAt: Date | null;
  decreaseAllowance: (amount: number) => void;
  fetchAndStoreTips: (ids: string[]) => void;
  hasAllowance: () => boolean;
  publicationTips: TipsCount[];
  setAllowance: (allowance: null | number) => void;
  setAllowanceResetsAt: (allowanceResetsAt: Date) => void;
}

const store = create<State>((set, get) => ({
  addOrUpdatePublicationTip: ({ amount, publicationId }) => {
    const tips = get().publicationTips;
    const tip = tips.find((tip) => tip.publicationId === publicationId);

    if (!tip) {
      set({
        publicationTips: [...tips, { amount, publicationId, tips: 1 }]
      });
    } else {
      set({
        publicationTips: [
          ...tips.map((tip) =>
            tip.publicationId === publicationId
              ? { ...tip, amount: tip.amount + amount, tips: tip.tips + 1 }
              : tip
          )
        ]
      });
    }
  },
  allowanceLeft: null,
  allowanceResetsAt: null,
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
  setAllowance: (allowance) => set({ allowanceLeft: allowance }),
  setAllowanceResetsAt: (allowanceResetsAt) =>
    set(() => ({ allowanceResetsAt }))
}));

export const useTipsStore = createTrackedSelector(store);
