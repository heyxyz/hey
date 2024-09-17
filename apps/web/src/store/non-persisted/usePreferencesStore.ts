import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  appIcon: number;
  email: null | string;
  emailVerified: boolean;
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  resetPreferences: () => void;
  setAppIcon: (appIcon: number) => void;
  setEmail: (email: null | string) => void;
  setEmailVerified: (emailVerified: boolean) => void;
  setHasDismissedOrMintedMembershipNft: (
    hasDismissedOrMintedMembershipNft: boolean
  ) => void;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
}

const store = create<State>((set) => ({
  appIcon: 0,
  email: null,
  emailVerified: false,
  hasDismissedOrMintedMembershipNft: true,
  highSignalNotificationFilter: false,
  resetPreferences: () =>
    set(() => ({
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false
    })),
  setAppIcon: (appIcon) => set(() => ({ appIcon })),
  setEmail: (email) => set(() => ({ email })),
  setEmailVerified: (emailVerified) => set(() => ({ emailVerified })),
  setHasDismissedOrMintedMembershipNft: (hasDismissedOrMintedMembershipNft) =>
    set(() => ({ hasDismissedOrMintedMembershipNft })),
  setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
    set(() => ({ highSignalNotificationFilter }))
}));

export const usePreferencesStore = createTrackedSelector(store);
