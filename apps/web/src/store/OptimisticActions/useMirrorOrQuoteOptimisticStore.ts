import { create } from 'zustand';

interface PublicationConfig {
  countMirrorOrQuote: number;
  mirroredOrQuoted: boolean;
}

interface MirrorOrQuoteOptimisticState {
  mirrorOrQuoteConfigs: Record<string, PublicationConfig>;
  setMirrorOrQuoteConfig: (
    publicationId: string,
    config: PublicationConfig
  ) => void;
  getMirrorOrQuoteCountByPublicationId: (publicationId: string) => number;
  hasQuotedOrMirroredByMe: (publicationId: string) => boolean;
}

export const useMirrorOrQuoteOptimisticStore =
  create<MirrorOrQuoteOptimisticState>((set, get) => ({
    mirrorOrQuoteConfigs: {},
    setMirrorOrQuoteConfig: (publicationId, config) =>
      set((state) => ({
        mirrorOrQuoteConfigs: {
          ...state.mirrorOrQuoteConfigs,
          [publicationId]: config
        }
      })),
    getMirrorOrQuoteCountByPublicationId: (publicationId) => {
      const { mirrorOrQuoteConfigs } = get();
      return mirrorOrQuoteConfigs[publicationId]?.countMirrorOrQuote || 0;
    },
    hasQuotedOrMirroredByMe: (publicationId) => {
      const { mirrorOrQuoteConfigs } = get();
      return !!mirrorOrQuoteConfigs[publicationId]?.mirroredOrQuoted;
    }
  }));
