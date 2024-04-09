import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  email: null | string;
  emailVerificationTokenExpired: boolean;
  emailVerified: boolean;
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  isPride: boolean;
  resetPreferences: () => void;
  setEmail: (email: null | string) => void;
  setEmailVerificationTokenExpired: (
    emailVerificationTokenExpired: boolean
  ) => void;
  setEmailVerified: (emailVerified: boolean) => void;
  setHasDismissedOrMintedMembershipNft: (
    hasDismissedOrMintedMembershipNft: boolean
  ) => void;
  setHighSignalNotificationFilter: (
    highSignalNotificationFilter: boolean
  ) => void;
  setIsPride: (isPride: boolean) => void;
}

const store = create<State>((set) => ({
  email: null,
  emailVerificationTokenExpired: false,
  emailVerified: false,
  hasDismissedOrMintedMembershipNft: true,
  highSignalNotificationFilter: false,
  isPride: false,
  resetPreferences: () =>
    set(() => ({
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false
    })),
  setEmail: (email) => set(() => ({ email })),
  setEmailVerificationTokenExpired: (emailVerificationTokenExpired) =>
    set(() => ({ emailVerificationTokenExpired })),
  setEmailVerified: (emailVerified) => set(() => ({ emailVerified })),
  setHasDismissedOrMintedMembershipNft: (hasDismissedOrMintedMembershipNft) =>
    set(() => ({ hasDismissedOrMintedMembershipNft })),
  setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
    set(() => ({ highSignalNotificationFilter })),
  setIsPride: (isPride) => set(() => ({ isPride }))
}));

export const usePreferencesStore = createTrackedSelector(store);
