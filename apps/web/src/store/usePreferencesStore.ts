import { create } from 'zustand';

interface PreferencesState {
  loadingPreferences: boolean;
  setLoadingPreferences: (loadingPreferences: boolean) => void;
  isPride: boolean;
  setIsPride: (isPride: boolean) => void;
  highSignalNotificationFilter: boolean;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  loadingPreferences: true,
  setLoadingPreferences: (loadingPreferences) =>
    set(() => ({ loadingPreferences })),
  isPride: false,
  setIsPride: (isPride) => set(() => ({ isPride })),
  highSignalNotificationFilter: false,
  setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
    set(() => ({ highSignalNotificationFilter })),
  resetPreferences: () =>
    set(() => ({
      isPride: false,
      highSignalNotificationFilter: false
    }))
}));
