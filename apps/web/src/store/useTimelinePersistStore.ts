import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimelinePersistState {
  feedEventFilters: Record<string, boolean>;
  setFeedEventFilters: (feedEventFilters: Record<string, boolean>) => void;
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
