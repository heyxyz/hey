import { LS_KEYS } from 'data/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  showLikesCount: boolean;
  setShowLikesCount: (showLikesCount: boolean) => void;
}

export const usePreferencesStore = create(
  persist<PreferencesState>(
    (set) => ({
      showLikesCount: true,
      setShowLikesCount: (showLikesCount) => set(() => ({ showLikesCount }))
    }),
    { name: LS_KEYS.PREFERENCES_STORE }
  )
);
