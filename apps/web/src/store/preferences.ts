import { LS_KEYS } from 'data/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  hideLikesCount: boolean;
  setHideLikesCount: (hideLikesCount: boolean) => void;
}

export const usePreferencesStore = create(
  persist<PreferencesState>(
    (set) => ({
      hideLikesCount: false,
      setHideLikesCount: (hideLikesCount) => set(() => ({ hideLikesCount }))
    }),
    { name: LS_KEYS.PREFERENCES_STORE }
  )
);
