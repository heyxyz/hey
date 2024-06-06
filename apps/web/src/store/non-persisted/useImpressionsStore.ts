import type { PublicationViewCount } from '@good/types/good';

import getPublicationsViews from '@good/helpers/getPublicationsViews';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  fetchAndStoreViews: (ids: string[]) => void;
  publicationViews: PublicationViewCount[];
}

const store = create<State>((set) => ({
  fetchAndStoreViews: async (ids) => {
    if (!ids.length) {
      return;
    }

    const viewsResponse = await getPublicationsViews(ids);
    set((state) => ({
      publicationViews: [...state.publicationViews, ...viewsResponse]
    }));
  },
  publicationViews: []
}));

export const useImpressionsStore = createTrackedSelector(store);
