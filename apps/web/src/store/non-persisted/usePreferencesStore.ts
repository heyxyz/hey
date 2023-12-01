import type { Preferences } from '@hey/types/hey';
import { create } from 'zustand';

export type ExtendedPreference = Omit<
  NonNullable<Preferences['preference']>,
  'id' | 'createdAt'
>;

const DefaultPreferences: ExtendedPreference = {
  isPride: false,
  highSignalNotificationFilter: false,
  email: null,
  marketingOptIn: false
};

interface PreferencesState {
  preferences: ExtendedPreference;
  setPreferences: (preferences: ExtendedPreference) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferences: DefaultPreferences,
  setPreferences: (preferences) =>
    set(() => ({ preferences: { ...preferences } })),
  resetPreferences: () => set(() => ({ preferences: DefaultPreferences }))
}));
