import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  mutingOrUnmutingAccount?: AccountFragment;
  showMuteOrUnmuteAlert: boolean;
  setShowMuteOrUnmuteAlert: (
    showMuteOrUnmuteAlert: boolean,
    mutingOrUnmutingAccount?: AccountFragment
  ) => void;
}

const store = create<State>((set) => ({
  mutingOrUnmutingAccount: undefined,
  showMuteOrUnmuteAlert: false,
  setShowMuteOrUnmuteAlert: (showMuteOrUnmuteAlert, mutingOrUnmutingAccount) =>
    set(() => ({ mutingOrUnmutingAccount, showMuteOrUnmuteAlert }))
}));

export const useMuteAlertStore = createTrackedSelector(store);
