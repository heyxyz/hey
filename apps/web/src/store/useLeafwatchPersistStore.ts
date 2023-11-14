import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LeafwatchPersistState {
  viewerId: string | null;
  setViewerId: (viewerId: string) => void;
  hydrateLeafwatchViewerId: () => string | null;
}

export const useLeafwatchPersistStore = create(
  persist<LeafwatchPersistState>(
    (set, get) => ({
      viewerId: null,
      setViewerId: (viewerId) => set({ viewerId }),
      hydrateLeafwatchViewerId: () => {
        return get().viewerId;
      }
    }),
    { name: Localstorage.LeafwatchStore }
  )
);

export const hydrateLeafwatchViewerId = () =>
  useLeafwatchPersistStore.getState().hydrateLeafwatchViewerId();
