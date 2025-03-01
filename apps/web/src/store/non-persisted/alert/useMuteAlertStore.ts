import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  mutingOrUnmutingAccount: null | AccountFragment;
  showMuteOrUnmuteAlert: boolean;
  setShowMuteOrUnmuteAlert: (
    showMuteOrUnmuteAlert: boolean,
    mutingOrUnmutingAccount: null | AccountFragment
  ) => void;
}

const store = create<State>((set) => ({
  mutingOrUnmutingAccount: null,
  showMuteOrUnmuteAlert: false,
  setShowMuteOrUnmuteAlert: (showMuteOrUnmuteAlert, mutingOrUnmutingAccount) =>
    set(() => ({ mutingOrUnmutingAccount, showMuteOrUnmuteAlert }))
}));

export const useMuteAlertStore = createTrackedSelector(store);
