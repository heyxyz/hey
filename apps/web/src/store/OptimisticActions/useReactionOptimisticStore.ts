import { create } from 'zustand';

interface PublicationConfig {
  countReaction: number;
  reacted: boolean;
}

interface ReactionOptimisticState {
  reactionConfigs: Record<string, PublicationConfig>;
  setReactionConfig: (publicationId: string, config: PublicationConfig) => void;
  getReactionCountByPublicationId: (publicationId: string) => number;
  hasReactedByMe: (publicationId: string) => boolean;
}

export const useReactionOptimisticStore = create<ReactionOptimisticState>(
  (set, get) => ({
    reactionConfigs: {},
    setReactionConfig: (publicationId, config) =>
      set((state) => ({
        reactionConfigs: {
          ...state.reactionConfigs,
          [publicationId]: config
        }
      })),
    getReactionCountByPublicationId: (publicationId) => {
      const { reactionConfigs } = get();
      return reactionConfigs[publicationId]?.countReaction || 0;
    },
    hasReactedByMe: (publicationId) => {
      const { reactionConfigs } = get();
      return !!reactionConfigs[publicationId]?.reacted;
    }
  })
);
