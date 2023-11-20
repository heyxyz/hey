import { create } from 'zustand';

interface FeatureFlagsState {
  loadingFeatureFlags: boolean;
  setLoadingFeatureFlags: (loadingFeatureFlags: boolean) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  gardenerMode: boolean;
  setGardenerMode: (gardenerMode: boolean) => void;
  featureFlags: string[];
  setFeatureFlags: (featureFlags: string[]) => void;
  resetFeatureFlags: () => void;
  hydrateFeatureFlags: () => { featureFlags: string[] };
}

export const useFeatureFlagsStore = create<FeatureFlagsState>((set, get) => ({
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
    })),
  hydrateFeatureFlags: () => {
    return {
      featureFlags: get().featureFlags
    };
  }
}));

export const hydrateFeatureFlags = () =>
  useFeatureFlagsStore.getState().hydrateFeatureFlags();
