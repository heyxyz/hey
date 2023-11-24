import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface FeatureFlagsState {
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  gardenerMode: boolean;
  setGardenerMode: (gardenerMode: boolean) => void;
  featureFlags: string[];
  setFeatureFlags: (featureFlags: string[]) => void;
  resetFeatureFlags: () => void;
  hydrateFeatureFlags: () => { featureFlags: string[] };
}

export const useFeatureFlagsStore = create(
  persist<FeatureFlagsState>(
    (set, get) => ({
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      gardenerMode: false,
      setGardenerMode: (gardenerMode) => set(() => ({ gardenerMode })),
      featureFlags: [],
      setFeatureFlags: (featureFlags) => set(() => ({ featureFlags })),
      resetFeatureFlags: () =>
        set(() => ({
          staffMode: false,
          gardenerMode: false,
          featureFlags: []
        })),
      hydrateFeatureFlags: () => {
        return {
          featureFlags: get().featureFlags
        };
      }
    }),
    {
      name: IndexDB.FeatureFlagsStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateFeatureFlags = () =>
  useFeatureFlagsStore.getState().hydrateFeatureFlags();
