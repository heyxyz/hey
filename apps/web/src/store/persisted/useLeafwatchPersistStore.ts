import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LeafwatchPersistState {
  anonymousId: string | null;
  setAnonymousId: (anonymousIdId: string) => void;
  hydrateLeafwatchAnonymousId: () => string | null;
}

export const useLeafwatchPersistStore = create(
  persist<LeafwatchPersistState>(
    (set, get) => ({
      anonymousId: null,
      setAnonymousId: (anonymousId) => set({ anonymousId }),
      hydrateLeafwatchAnonymousId: () => {
        return get().anonymousId;
      }
    }),
    { name: Localstorage.LeafwatchStore }
  )
);

export const hydrateLeafwatchAnonymousId = () =>
  useLeafwatchPersistStore.getState().hydrateLeafwatchAnonymousId();
