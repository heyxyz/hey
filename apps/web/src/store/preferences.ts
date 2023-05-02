import { Localstorage } from 'data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  hideLikesCount: boolean;
  setHideLikesCount: (hideLikesCount: boolean) => void;
  highSignalNotificationFilter: boolean;
  setHighSignalNotificationFilter: (highSignalNotificationFilter: boolean) => void;
}

export const usePreferencesStore = create(
  persist<PreferencesState>(
    (set) => ({
      hideLikesCount: false,
      setHideLikesCount: (hideLikesCount) => set(() => ({ hideLikesCount })),
      highSignalNotificationFilter: true,
      setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
        set(() => ({ highSignalNotificationFilter }))
    }),
    { name: Localstorage.PreferencesStore }
  )
);
