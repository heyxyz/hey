import { Localstorage } from "@hey/data/storage";
import type { AccountFieldsFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  currentAccount: null | AccountFieldsFragment;
  isSignlessEnabled: boolean;
  setCurrentAccount: ({
    currentAccount,
    isSignlessEnabled
  }: {
    currentAccount: null | AccountFieldsFragment;
    isSignlessEnabled: boolean;
  }) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentAccount: null,
      isSignlessEnabled: false,
      setCurrentAccount: ({ currentAccount, isSignlessEnabled }) =>
        set(() => ({ currentAccount, isSignlessEnabled }))
    }),
    { name: Localstorage.AccountStore }
  )
);

export const useAccountStore = createTrackedSelector(store);
