import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface FeatureFlagsState {
  featureFlags: string[];
  gardenerMode: boolean;
  hydrateFeatureFlags: () => { featureFlags: string[] };
  resetFeatureFlags: () => void;
  setFeatureFlags: (featureFlags: string[]) => void;
  setGardenerMode: (gardenerMode: boolean) => void;
  setStaffMode: (staffMode: boolean) => void;
  staffMode: boolean;
}

export const useFeatureFlagsStore = create(
  persist<FeatureFlagsState>(
    (set, get) => ({
      featureFlags: [],
      gardenerMode: false,
      hydrateFeatureFlags: () => {
        return {
          featureFlags: get().featureFlags
        };
      },
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
    {
      name: IndexDB.FeatureFlagsStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateFeatureFlags = () =>
  useFeatureFlagsStore.getState().hydrateFeatureFlags();
