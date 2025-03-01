import type { AccountFieldsFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  banningOrUnbanningAccount: null | AccountFieldsFragment;
  banningGroupAddress: null | string;
  banning: boolean;
  showBanOrUnbanAlert: boolean;
  setShowBanOrUnbanAlert: (
    showBanOrUnbanAlert: boolean,
    banning: boolean,
    banningOrUnbanningAccount: null | AccountFieldsFragment,
    banningGroupAddress: null | string
  ) => void;
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

export const useBanAlertStore = createTrackedSelector(store);
