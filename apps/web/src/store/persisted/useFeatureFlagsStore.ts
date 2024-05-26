import { IndexDB } from '@hey/data/storage';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../helpers/createIdbStorage';

interface State {
  featureFlags: string[];
  hydrateFeatureFlags: () => string[];
  resetFeatureFlags: () => void;
  setFeatureFlags: (featureFlags: string[]) => void;
  setStaffMode: (staffMode: boolean) => void;
  staffMode: boolean;
}

const store = create(
  persist<State>(
    (set, get) => ({
      featureFlags: [],
      hydrateFeatureFlags: () => get().featureFlags,
      resetFeatureFlags: () =>
        set(() => ({
          featureFlags: [],
          staffMode: false
        })),
      setFeatureFlags: (featureFlags) => set(() => ({ featureFlags })),
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      staffMode: false
    }),
    { name: IndexDB.FeatureFlagsStore, storage: createIdbStorage() }
  )
);

export const hydrateFeatureFlags = () => store.getState().hydrateFeatureFlags();
export const useFeatureFlagsStore = createTrackedSelector(store);
