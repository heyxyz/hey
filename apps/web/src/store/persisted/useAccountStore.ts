import { Localstorage } from "@hey/data/storage";
import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  currentAccount?: AccountFragment;
  isSignlessEnabled: boolean;
  setCurrentAccount: ({
    currentAccount,
    isSignlessEnabled
  }: {
    currentAccount?: AccountFragment;
    isSignlessEnabled: boolean;
  }) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentAccount: undefined,
      isSignlessEnabled: false,
      setCurrentAccount: ({ currentAccount, isSignlessEnabled }) =>
        set(() => ({ currentAccount, isSignlessEnabled }))
    }),
    { name: Localstorage.AccountStore }
  )
);

export const useAccountStore = createTrackedSelector(store);
