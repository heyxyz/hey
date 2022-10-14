import create from 'zustand';
import { persist } from 'zustand/middleware';

interface TransactionPersistState {
  feedEventFilters: Record<string, boolean>;
  setFeedEventFilters: (feedEventFilters: Record<string, boolean>) => void;
}

export const useTimelinePersistStore = create(
  persist<TransactionPersistState>(
    (set) => ({
      feedEventFilters: { posts: true, collects: true, mirrors: true, reactions: true },
      setFeedEventFilters: (feedEventFilters) => set(() => ({ feedEventFilters }))
    }),
    { name: 'timeline.store' }
  )
);
