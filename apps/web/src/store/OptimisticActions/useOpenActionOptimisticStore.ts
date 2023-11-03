import { create } from 'zustand';

interface PublicationConfig {
  countOpenActions: number;
  acted: boolean;
}

interface OpenActionOptimisticState {
  openActionPublicationConfigs: Record<string, PublicationConfig>;
  setOpenActionPublicationConfig: (
    publicationId: string,
    config: PublicationConfig
  ) => void;
  getOpenActionCountByPublicationId: (publicationId: string) => number;
  hasActedByMe: (publicationId: string) => boolean;
}

export const useOpenActionOptimisticStore = create<OpenActionOptimisticState>(
  (set, get) => ({
    openActionPublicationConfigs: {},

    setOpenActionPublicationConfig: (publicationId, config) =>
      set((state) => ({
        openActionPublicationConfigs: {
          ...state.openActionPublicationConfigs,
          [publicationId]: config
        }
      })),

    getOpenActionCountByPublicationId: (publicationId) => {
      const { openActionPublicationConfigs } = get();
      return openActionPublicationConfigs[publicationId]?.countOpenActions || 0;
    },

    hasActedByMe: (publicationId) => {
      const { openActionPublicationConfigs } = get();
      return !!openActionPublicationConfigs[publicationId]?.acted;
    }
  })
);
