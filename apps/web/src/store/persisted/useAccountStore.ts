import { Localstorage } from "@hey/data/storage";
import type { Account } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  currentAccount: null | Account;
  fallbackToCuratedFeed: boolean;
  setCurrentAccount: (currentAccount: null | Account) => void;
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
