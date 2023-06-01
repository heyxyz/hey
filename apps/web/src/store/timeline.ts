import type { Profile } from '@lenster/lens';
import { Localstorage } from '@lenster/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimelinePersistState {
  feedEventFilters: Record<string, boolean>;
  setFeedEventFilters: (feedEventFilters: Record<string, boolean>) => void;
}

interface TimelineState {
  seeThroughProfile: Profile | null;
  setSeeThroughProfile: (profile: Profile | null) => void;
}

export const useTimelinePersistStore = create(
  persist<TimelinePersistState>(
    (set) => ({
      feedEventFilters: {
        posts: true,
        collects: true,
        mirrors: true,
        likes: false
      },
      setFeedEventFilters: (feedEventFilters) =>
        set(() => ({ feedEventFilters }))
    }),
    { name: Localstorage.TimelineStore }
  )
);

export const useTimelineStore = create<TimelineState>((set) => ({
  seeThroughProfile: null,
  setSeeThroughProfile: (seeThroughProfile) =>
    set(() => ({ seeThroughProfile }))
}));
