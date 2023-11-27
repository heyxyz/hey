import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimelineFilterState {
  feedEventFilters: Record<string, boolean>;
  setFeedEventFilters: (feedEventFilters: Record<string, boolean>) => void;
}

export const useTimelineFilterStore = create(
  persist<TimelineFilterState>(
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
