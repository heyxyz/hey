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
  hasDismissedOrMintedMembershipNft: boolean;
  isPro: boolean;
  isTrusted: boolean;
  preferences: ExtendedPreference;
  resetPreferences: () => void;
  setHasDismissedOrMintedMembershipNft: (
    hasDismissedOrMintedMembershipNft: boolean
  ) => void;
  setIsPro: (isPro: boolean) => void;
  setIsTrusted: (isTrusted: boolean) => void;
  setPreferences: (preferences: ExtendedPreference) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  hasDismissedOrMintedMembershipNft: true,
  isPro: false,
  isTrusted: false,
  preferences: DefaultPreferences,
  resetPreferences: () =>
    set(() => ({
      isPro: false,
      isTrusted: false,
      preferences: DefaultPreferences
    })),
  setHasDismissedOrMintedMembershipNft: (hasDismissedOrMintedMembershipNft) =>
    set(() => ({ hasDismissedOrMintedMembershipNft })),
  setIsPro: (isPro) => set(() => ({ isPro })),
  setIsTrusted: (isTrusted) => set(() => ({ isTrusted })),
  setPreferences: (preferences) =>
    set(() => ({ preferences: { ...preferences } }))
}));
