import { LS_KEYS } from 'data/constants';
import type { Profile } from 'lens';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface TimelinePersistState {
  feedEventFilters: Record<string, boolean>;
  setFeedEventFilters: (feedEventFilters: Record<string, boolean>) => void;
}

interface TimelineState {
  seeThroughProfile: Profile | null;
  setSeeThroughProfile: (profile: Profile | null) => void;
  recommendedProfilesToSeeThrough: Profile[];
  setRecommendedProfilesToSeeThrough: (profiles: Profile[]) => void;
}

export const useTimelinePersistStore = create(
  persist<TimelinePersistState>(
    (set) => ({
      feedEventFilters: { posts: true, collects: true, mirrors: true, likes: false },
      setFeedEventFilters: (feedEventFilters) => set(() => ({ feedEventFilters }))
    }),
    { name: LS_KEYS.TIMELINE_STORE }
  )
);

export const useTimelineStore = create<TimelineState>((set) => ({
  seeThroughProfile: null,
  setSeeThroughProfile: (seeThroughProfile) => set(() => ({ seeThroughProfile })),
  recommendedProfilesToSeeThrough: [],
  setRecommendedProfilesToSeeThrough: (recommendedProfilesToSeeThrough) =>
    set(() => ({ recommendedProfilesToSeeThrough }))
}));
