import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface FeatureFlagsState {
  featuresLoaded: boolean;
  setFeaturesLoaded: (featuresLoaded: boolean) => void;
  loadingFeatureFlags: boolean;
  setLoadingFeatureFlags: (loadingFeatureFlags: boolean) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  gardenerMode: boolean;
  setGardenerMode: (gardenerMode: boolean) => void;
  featureFlags: string[];
  setFeatureFlags: (featureFlags: string[]) => void;
  resetFeatureFlags: () => void;
}

export const useFeatureFlagsStore = create(
  persist<FeatureFlagsState>(
    (set) => ({
      featuresLoaded: false,
      setFeaturesLoaded: (featuresLoaded) => set(() => ({ featuresLoaded })),
      loadingFeatureFlags: true,
      setLoadingFeatureFlags: (loadingFeatureFlags) =>
        set(() => ({ loadingFeatureFlags })),
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
        }))
    }),
    {
      name: IndexDB.FeatureFlagsStore,
      storage: createIdbStorage()
    }
  )
);

export const featureFlags = () => useFeatureFlagsStore.getState().featureFlags;
