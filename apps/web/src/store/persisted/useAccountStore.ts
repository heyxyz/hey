import { Localstorage } from "@hey/data/storage";
import type { Profile } from "@hey/lens";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  currentAccount: null | Profile;
  fallbackToCuratedFeed: boolean;
  setCurrentAccount: (currentAccount: null | Profile) => void;
  setFallbackToCuratedFeed: (fallbackToCuratedFeed: boolean) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentAccount: null,
      fallbackToCuratedFeed: false,
      setCurrentAccount: (currentAccount) => set(() => ({ currentAccount })),
      setFallbackToCuratedFeed: (fallbackToCuratedFeed) =>
        set(() => ({ fallbackToCuratedFeed }))
    }),
    { name: Localstorage.AccountStore }
  )
);

export const useAccountStore = createTrackedSelector(store);
