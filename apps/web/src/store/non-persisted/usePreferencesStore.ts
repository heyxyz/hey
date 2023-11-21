import { create } from 'zustand';

interface PreferencesState {
  isPride: boolean;
  setIsPride: (isPride: boolean) => void;
  highSignalNotificationFilter: boolean;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
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
