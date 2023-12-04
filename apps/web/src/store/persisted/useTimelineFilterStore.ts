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
        collects: true,
        likes: false,
        mirrors: true,
        posts: true
      },
      setFeedEventFilters: (feedEventFilters) =>
        set(() => ({ feedEventFilters }))
    }),
    { name: Localstorage.TimelineStore }
  )
);
