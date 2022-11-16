import type { Profile } from '@generated/types';
import { LS_KEYS } from 'src/constants';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface TimelinePersistState {
  feedEventFilters: Record<string, boolean>;
  setFeedEventFilters: (feedEventFilters: Record<string, boolean>) => void;
}

interface TimelineState {
  seeThroughProfile: Profile | null;
  recommendProfilesToSeeThrough: Profile[];
  setRecommendProfilesToSeeThrough: (profiles: Profile[]) => void;
  setSeeThroughProfile: (profile: Profile | null) => void;
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
  recommendProfilesToSeeThrough: [],
  seeThroughProfile: null,
  setRecommendProfilesToSeeThrough: (recommendProfilesToSeeThrough) =>
    set(() => ({ recommendProfilesToSeeThrough })),
  setSeeThroughProfile: (seeThroughProfile) => set(() => ({ seeThroughProfile }))
}));
