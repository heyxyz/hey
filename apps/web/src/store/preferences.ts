import { Localstorage } from '@lenster/data';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  highSignalNotificationFilter: boolean;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
}

export const usePreferencesStore = create(
  persist<PreferencesState>(
    (set) => ({
      highSignalNotificationFilter: true,
      setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
        set(() => ({ highSignalNotificationFilter }))
    }),
    { name: Localstorage.PreferencesStore }
  )
);
