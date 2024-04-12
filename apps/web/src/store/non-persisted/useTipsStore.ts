import type { PublicationViewCount } from '@hey/types/hey';

import getPublicationsTips from '@hey/lib/getPublicationsTips';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  fetchAndStoreTips: (ids: string[]) => void;
  publicationTips: PublicationViewCount[];
}

const store = create<State>((set) => ({
  fetchAndStoreTips: async (ids) => {
    if (!ids.length) {
      return;
    }

    const viewsResponse = await getPublicationsTips(ids);
    set((state) => ({
      publicationTips: [...state.publicationTips, ...viewsResponse]
    }));
  },
  publicationTips: []
}));

export const useTipsStore = createTrackedSelector(store);
