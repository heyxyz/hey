import { Localstorage } from "@hey/data/storage";
import type { MutedWord } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  appIcon: number;
  email: null | string;
  emailVerified: boolean;
  hasDismissedOrMintedMembershipNft: boolean;
  highSignalNotificationFilter: boolean;
  developerMode: boolean;
  mutedWords: MutedWord[];
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
  setDeveloperMode: (developerMode: boolean) => void;
  setMutedWords: (mutedWords: MutedWord[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      appIcon: 0,
      email: null,
      emailVerified: false,
      hasDismissedOrMintedMembershipNft: true,
      highSignalNotificationFilter: false,
      developerMode: false,
      mutedWords: [],
      resetPreferences: () =>
        set(() => ({
          hasDismissedOrMintedMembershipNft: true,
          highSignalNotificationFilter: false
        })),
      setAppIcon: (appIcon) => set(() => ({ appIcon })),
      setEmail: (email) => set(() => ({ email })),
      setEmailVerified: (emailVerified) => set(() => ({ emailVerified })),
      setHasDismissedOrMintedMembershipNft: (
        hasDismissedOrMintedMembershipNft
      ) => set(() => ({ hasDismissedOrMintedMembershipNft })),
      setHighSignalNotificationFilter: (highSignalNotificationFilter) =>
        set(() => ({ highSignalNotificationFilter })),
      setDeveloperMode: (developerMode) => set(() => ({ developerMode })),
      setMutedWords: (mutedWords) => set(() => ({ mutedWords })),
      setLoading: (loading) => set(() => ({ loading })),
      loading: false
    }),
    { name: Localstorage.PreferencesStore }
  )
);

export const usePreferencesStore = createTrackedSelector(store);
