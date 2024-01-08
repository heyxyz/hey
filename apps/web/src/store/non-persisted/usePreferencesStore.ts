import { create } from 'zustand';

interface PreferencesState {
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  isPride: boolean;
  isPro: boolean;
  isTrusted: boolean;
  resetPreferences: () => void;
  setHasDismissedOrMintedMembershipNft: (
    hasDismissedOrMintedMembershipNft: boolean
  ) => void;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
  setIsPride: (isPride: boolean) => void;
  setIsPro: (isPro: boolean) => void;
  setIsTrusted: (isTrusted: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  hasDismissedOrMintedMembershipNft: true,
  highSignalNotificationFilter: false,
  isPride: false,
  isPro: false,
  isTrusted: false,
  resetPreferences: () =>
    set(() => ({
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false,
      isPro: false,
      isTrusted: false
    })),
  setHasDismissedOrMintedMembershipNft: (hasDismissedOrMintedMembershipNft) =>
    set(() => ({ hasDismissedOrMintedMembershipNft })),
  setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
    set(() => ({ highSignalNotificationFilter })),
  setIsPride: (isPride) => set(() => ({ isPride })),
  setIsPro: (isPro) => set(() => ({ isPro })),
  setIsTrusted: (isTrusted) => set(() => ({ isTrusted }))
}));
