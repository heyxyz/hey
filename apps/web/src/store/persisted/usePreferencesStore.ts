import { Localstorage } from "@hey/data/storage";
import type { MutedWord } from "@hey/types/hey";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  appIcon: number;
  hasDismissedOrMintedMembershipNft: boolean;
  includeLowScore: boolean;
  mutedWords: MutedWord[];
  resetPreferences: () => void;
  setAppIcon: (appIcon: number) => void;
  setHasDismissedOrMintedMembershipNft: (
    hasDismissedOrMintedMembershipNft: boolean
  ) => void;
  setIncludeLowScore: (includeLowScore: boolean) => void;
  setMutedWords: (mutedWords: MutedWord[]) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      appIcon: 0,
      hasDismissedOrMintedMembershipNft: true,
      includeLowScore: false,
      mutedWords: [],
      resetPreferences: () =>
        set(() => ({
          hasDismissedOrMintedMembershipNft: true,
          includeLowScore: false
        })),
      setAppIcon: (appIcon) => set(() => ({ appIcon })),
      setHasDismissedOrMintedMembershipNft: (
        hasDismissedOrMintedMembershipNft
      ) => set(() => ({ hasDismissedOrMintedMembershipNft })),
      setIncludeLowScore: (includeLowScore) => set(() => ({ includeLowScore })),
      setMutedWords: (mutedWords) => set(() => ({ mutedWords }))
    }),
    { name: Localstorage.PreferencesStore }
  )
);

export const usePreferencesStore = createTrackedSelector(store);
