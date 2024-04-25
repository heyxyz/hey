import type { PublicationTip } from '@hey/types/hey';

import getPublicationsTips from '@hey/lib/api/getPublicationsTips';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  fetchAndStoreTips: (ids: string[]) => void;
  publicationTips: PublicationTip[];
}

const store = create<State>((set) => ({
  fetchAndStoreTips: async (ids) => {
    if (!ids.length) {
      return;
    }

    const tipsResponse = await getPublicationsTips(ids, getAuthApiHeaders());
    set((state) => ({
      publicationTips: [...state.publicationTips, ...tipsResponse]
    }));
  },
  publicationTips: []
}));

export const useTipsStore = createTrackedSelector(store);
