import { Localstorage } from "@hey/data/storage";
import type { Account } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  currentAccount: null | Account;
  fallbackToCuratedFeed: boolean;
  isSignlessEnabled: boolean;
  setCurrentAccount: ({
    currentAccount,
    isSignlessEnabled
  }: {
    currentAccount: null | Account;
    isSignlessEnabled: boolean;
  }) => void;
  setFallbackToCuratedFeed: (fallbackToCuratedFeed: boolean) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentAccount: null,
      fallbackToCuratedFeed: false,
      isSignlessEnabled: false,
      setCurrentAccount: ({ currentAccount, isSignlessEnabled }) =>
        set(() => ({ currentAccount, isSignlessEnabled })),
      setFallbackToCuratedFeed: (fallbackToCuratedFeed) =>
        set(() => ({ fallbackToCuratedFeed }))
    }),
    { name: Localstorage.AccountStore }
  )
);

export const useAccountStore = createTrackedSelector(store);
