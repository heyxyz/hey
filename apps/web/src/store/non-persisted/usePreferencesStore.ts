import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
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

const store = create<State>((set) => ({
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

export const usePreferencesStore = createTrackedSelector(store);
