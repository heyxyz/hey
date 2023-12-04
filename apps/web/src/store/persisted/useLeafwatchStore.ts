import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LeafwatchState {
  anonymousId: null | string;
  hydrateLeafwatchAnonymousId: () => null | string;
  setAnonymousId: (anonymousIdId: string) => void;
}

export const useLeafwatchStore = create(
  persist<LeafwatchState>(
    (set, get) => ({
      anonymousId: null,
      hydrateLeafwatchAnonymousId: () => {
        return get().anonymousId;
      },
      setAnonymousId: (anonymousId) => set({ anonymousId })
    }),
    { name: Localstorage.LeafwatchStore }
  )
);

export const hydrateLeafwatchAnonymousId = () =>
  useLeafwatchStore.getState().hydrateLeafwatchAnonymousId();
