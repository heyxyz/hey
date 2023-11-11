import { create } from 'zustand';

interface PreferencesState {
  loadingPreferences: boolean;
  setLoadingPreferences: (loadingPreferences: boolean) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  gardenerMode: boolean;
  setGardenerMode: (gardenerMode: boolean) => void;
  isPride: boolean;
  setIsPride: (isPride: boolean) => void;
  highSignalNotificationFilter: boolean;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
  featureFlags: string[];
  setFeatureFlags: (featureFlags: string[]) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  loadingPreferences: true,
  setLoadingPreferences: (loadingPreferences) =>
    set(() => ({ loadingPreferences })),
  staffMode: false,
  setStaffMode: (staffMode) => set(() => ({ staffMode })),
  gardenerMode: false,
  setGardenerMode: (gardenerMode) => set(() => ({ gardenerMode })),
  isPride: false,
  setIsPride: (isPride) => set(() => ({ isPride })),
  highSignalNotificationFilter: false,
  setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
    set(() => ({ highSignalNotificationFilter })),
  featureFlags: [],
  setFeatureFlags: (featureFlags) => set(() => ({ featureFlags })),
  resetPreferences: () =>
    set(() => ({
      staffMode: false,
      gardenerMode: false,
      isPride: false,
      highSignalNotificationFilter: false,
      featureFlags: []
    }))
}));

export const featureFlags = () => usePreferencesStore.getState().featureFlags;
