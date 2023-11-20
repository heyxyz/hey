import { IndexDB } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface PreferencesState {
  preferencesLoaded: boolean;
  setPreferencesLoaded: (preferencesLoaded: boolean) => void;
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

export const usePreferencesStore = create(
  persist<PreferencesState>(
    (set) => ({
      preferencesLoaded: false,
      setPreferencesLoaded: (preferencesLoaded) =>
        set(() => ({ preferencesLoaded })),
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
    }),
    {
      name: IndexDB.PreferencesStore,
      storage: createIdbStorage()
    }
  )
);
