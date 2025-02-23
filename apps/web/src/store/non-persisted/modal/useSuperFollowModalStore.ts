import type { Account } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showSuperFollowModal: boolean;
  superFollowingAccount: null | Account;
  setShowSuperFollowModal: (
    showSuperFollowModal: boolean,
    superFollowingAccount: null | Account
  ) => void;
}

const store = create<State>((set) => ({
  showSuperFollowModal: false,
  superFollowingAccount: null,
  setShowSuperFollowModal: (showSuperFollowModal, superFollowingAccount) =>
    set(() => ({ showSuperFollowModal, superFollowingAccount }))
}));

export const useSuperFollowModalStore = createTrackedSelector(store);
