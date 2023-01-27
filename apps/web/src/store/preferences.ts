import { LS_KEYS } from 'data/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  hideLikesCount: boolean;
  setHideLikesCount: (hideLikesCount: boolean) => void;
  hideWav3sReward: boolean;
  setHideWav3sReward: (hideWav3sReward: boolean) => void;
}

export const usePreferencesStore = create(
  persist<PreferencesState>(
    (set) => ({
      hideLikesCount: false,
      setHideLikesCount: (hideLikesCount) => set(() => ({ hideLikesCount })),
      hideWav3sReward: false,
      setHideWav3sReward: (hideWav3sReward) => set(() => ({ hideWav3sReward }))
    }),
    { name: LS_KEYS.PREFERENCES_STORE }
  )
);
