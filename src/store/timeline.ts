import { LS_KEYS } from 'src/constants';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface TimelinePersistState {
  feedEventFilters: Record<string, boolean>;
  setFeedEventFilters: (feedEventFilters: Record<string, boolean>) => void;
}

export const useTimelinePersistStore = create(
  persist<TimelinePersistState>(
    (set) => ({
      feedEventFilters: { posts: true, collects: true, mirrors: true, reactions: true },
      setFeedEventFilters: (feedEventFilters) => set(() => ({ feedEventFilters }))
    }),
    { name: LS_KEYS.TIMELINE_STORE }
  )
);
