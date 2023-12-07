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
  preferences: ExtendedPreference;
  resetPreferences: () => void;
  setPreferences: (preferences: ExtendedPreference) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferences: DefaultPreferences,
  resetPreferences: () => set(() => ({ preferences: DefaultPreferences })),
  setPreferences: (preferences) =>
    set(() => ({ preferences: { ...preferences } }))
}));
