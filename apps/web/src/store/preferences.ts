import { Localstorage } from 'data/storage';
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
    { name: Localstorage.PreferencesStore }
  )
);
