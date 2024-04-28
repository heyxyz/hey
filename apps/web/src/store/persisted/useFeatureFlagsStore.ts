import { IndexDB } from '@hey/data/storage';
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../helpers/createIdbStorage';

interface State {
  featureFlags: string[];
  gardenerMode: boolean;
  hydrateFeatureFlags: () => string[];
  resetFeatureFlags: () => void;
  setFeatureFlags: (featureFlags: string[]) => void;
  setGardenerMode: (gardenerMode: boolean) => void;
  setStaffMode: (staffMode: boolean) => void;
  staffMode: boolean;
}

const store = create(
  persist<State>(
    (set, get) => ({
      featureFlags: [],
      gardenerMode: false,
      hydrateFeatureFlags: () => get().featureFlags,
      resetFeatureFlags: () =>
        set(() => ({
          featureFlags: [],
          gardenerMode: false,
          staffMode: false
        })),
      setFeatureFlags: (featureFlags) => set(() => ({ featureFlags })),
      setGardenerMode: (gardenerMode) => set(() => ({ gardenerMode })),
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      staffMode: false
    }),
    { name: IndexDB.FeatureFlagsStore, storage: createIdbStorage() }
  )
);

export const hydrateFeatureFlags = () => store.getState().hydrateFeatureFlags();
export const useFeatureFlagsStore = createTrackedSelector(store);
