import type { Preferences } from '@hey/types/hey';

import { create } from 'zustand';

export type ExtendedPreference = Omit<
  NonNullable<Preferences['preference']>,
  'createdAt' | 'id'
>;

const DefaultPreferences: ExtendedPreference = {
  highSignalNotificationFilter: false,
  isPride: false
};

interface PreferencesState {
  isPro: boolean;
  isTrusted: boolean;
  preferences: ExtendedPreference;
  resetPreferences: () => void;
  setIsPro: (isPro: boolean) => void;
  setIsTrusted: (isTrusted: boolean) => void;
  setPreferences: (preferences: ExtendedPreference) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  isPro: false,
  isTrusted: false,
  preferences: DefaultPreferences,
  resetPreferences: () =>
    set(() => ({
      isPro: false,
      isTrusted: false,
      preferences: DefaultPreferences
    })),
  setIsPro: (isPro) => set(() => ({ isPro })),
  setIsTrusted: (isTrusted) => set(() => ({ isTrusted })),
  setPreferences: (preferences) =>
    set(() => ({ preferences: { ...preferences } }))
}));
