import { create } from 'zustand';

interface PreferencesState {
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  isPride: boolean;
  resetPreferences: () => void;
  setHasDismissedOrMintedMembershipNft: (
    hasDismissedOrMintedMembershipNft: boolean
  ) => void;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
  setIsPride: (isPride: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  hasDismissedOrMintedMembershipNft: true,
  highSignalNotificationFilter: false,
  isPride: false,
  resetPreferences: () =>
    set(() => ({
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false
    })),
  setHasDismissedOrMintedMembershipNft: (hasDismissedOrMintedMembershipNft) =>
    set(() => ({ hasDismissedOrMintedMembershipNft })),
  setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
    set(() => ({ highSignalNotificationFilter })),
  setIsPride: (isPride) => set(() => ({ isPride }))
}));
