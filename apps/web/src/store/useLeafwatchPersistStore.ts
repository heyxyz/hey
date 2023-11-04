import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LeafwatchPersistState {
  viewerId: string | null;
  setViewerId: (viewerId: string) => void;
}

export const useLeafwatchPersistStore = create(
  persist<LeafwatchPersistState>(
    (set) => ({
      viewerId: null,
      setViewerId: (viewerId) => set({ viewerId })
    }),
    { name: Localstorage.LeafwatchStore }
  )
);
