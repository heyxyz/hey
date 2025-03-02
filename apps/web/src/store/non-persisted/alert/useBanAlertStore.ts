import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  banningOrUnbanningAccount?: AccountFragment;
  banningGroupAddress?: string;
  banning: boolean;
  showBanOrUnbanAlert: boolean;
  setShowBanOrUnbanAlert: (
    showBanOrUnbanAlert: boolean,
    banning: boolean,
    banningOrUnbanningAccount?: AccountFragment,
    banningGroupAddress?: string
  ) => void;
}

const store = create<State>((set) => ({
  banningOrUnbanningAccount: undefined,
  banningGroupAddress: undefined,
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

export const useBanAlertStore = createTrackedSelector(store);
