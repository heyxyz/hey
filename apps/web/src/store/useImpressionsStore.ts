import type { PublicationViewCount } from '@hey/types/hey';
import getPublicationsViews from '@lib/getPublicationsViews';
import { create } from 'zustand';

interface ImpressionsState {
  publicationViews: PublicationViewCount[];
  fetchAndStoreViews: (ids: string[]) => void;
}

export const useImpressionsStore = create<ImpressionsState>((set) => ({
  publicationViews: [],
  fetchAndStoreViews: async (ids) => {
    if (!ids.length) {
      return;
    }

    const viewsResponse = await getPublicationsViews(ids);
    set((state) => ({
      publicationViews: [...state.publicationViews, ...viewsResponse]
    }));
  }
}));
