import { create } from 'zustand';

export type Preferences = {
  isPride: boolean;
  highSignalNotificationFilter: boolean;
  email: string | null;
  marketingOptIn: boolean;
};

const DefaultPreferences: Preferences = {
  isPride: false,
  highSignalNotificationFilter: false,
  email: null,
  marketingOptIn: false
};

interface PreferencesState {
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferences: DefaultPreferences,
  setPreferences: (preferences) =>
    set(() => ({ preferences: { ...preferences } })),
  resetPreferences: () => set(() => ({ preferences: DefaultPreferences }))
}));
