import type { Account } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  banningOrUnbanningAccount: null | Account;
  banningGroupAddress: null | string;
  banning: boolean;
  setShowBanOrUnbanAlert: (
    showBanOrUnbanAlert: boolean,
    banning: boolean,
    banningOrUnbanningAccount: null | Account,
    banningGroupAddress: null | string
  ) => void;
  showBanOrUnbanAlert: boolean;
}

const store = create<State>((set) => ({
  banningOrUnbanningAccount: null,
  banningGroupAddress: null,
  banning: false,
  showBanOrUnbanAlert: false,
  setShowBanOrUnbanAlert: (
    showBanOrUnbanAlert,
    banning,
    banningOrUnbanningAccount,
    banningGroupAddress
  ) =>
    set(() => ({
      banning,
      banningOrUnbanningAccount,
      banningGroupAddress,
      showBanOrUnbanAlert
    }))
}));

export const useBanAlertStateStore = createTrackedSelector(store);
