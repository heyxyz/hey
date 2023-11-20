import { create } from 'zustand';

interface FeatureFlagsState {
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  gardenerMode: boolean;
  setGardenerMode: (gardenerMode: boolean) => void;
  featureFlags: string[];
  setFeatureFlags: (featureFlags: string[]) => void;
  resetFeatureFlags: () => void;
}

export const useFeatureFlagsStore = create<FeatureFlagsState>((set) => ({
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
}));

export const featureFlags = () => useFeatureFlagsStore.getState().featureFlags;
