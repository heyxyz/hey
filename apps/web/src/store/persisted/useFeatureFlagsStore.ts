import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface FeatureFlagsState {
  featureFlags: string[];
  gardenerMode: boolean;
  hydrateFeatureFlags: () => string[];
  hydrateKillSwitches: () => string[];
  killSwitches: string[];
  resetFeatureFlags: () => void;
  setFeatureFlags: (featureFlags: string[]) => void;
  setGardenerMode: (gardenerMode: boolean) => void;
  setKillSwitches: (killSwitches: string[]) => void;
  setStaffMode: (staffMode: boolean) => void;
  setTrusted: (trusted: boolean) => void;
  staffMode: boolean;
  trusted: boolean;
}

export const useFeatureFlagsStore = create(
  persist<FeatureFlagsState>(
    (set, get) => ({
      featureFlags: [],
      gardenerMode: false,
      hydrateFeatureFlags: () => get().featureFlags,
      hydrateKillSwitches: () => get().killSwitches,
      killSwitches: [],
      resetFeatureFlags: () =>
        set(() => ({
          featureFlags: [],
          gardenerMode: false,
          staffMode: false
        })),
      setFeatureFlags: (featureFlags) => set(() => ({ featureFlags })),
      setGardenerMode: (gardenerMode) => set(() => ({ gardenerMode })),
      setKillSwitches: (killSwitches) => set(() => ({ killSwitches })),
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      setTrusted: (trusted) => set(() => ({ trusted })),
      staffMode: false,
      trusted: false
    }),
    {
      name: IndexDB.FeatureFlagsStore,
      storage: createIdbStorage()
    }
  )
);

export const hydrateFeatureFlags = () =>
  useFeatureFlagsStore.getState().hydrateFeatureFlags();
export const hydrateKillSwitches = () =>
  useFeatureFlagsStore.getState().hydrateKillSwitches();
