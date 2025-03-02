import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showReportAccountModal: boolean;
  reportingAccount?: AccountFragment;
  setShowReportAccountModal: (
    showReportAccountModal: boolean,
    reportingAccount?: AccountFragment
  ) => void;
}

const store = create<State>((set) => ({
  showReportAccountModal: false,
  reportingAccount: undefined,
  setShowReportAccountModal: (showReportAccountModal, reportingAccount) =>
    set(() => ({ showReportAccountModal, reportingAccount }))
}));

export const useReportAccountModalStore = createTrackedSelector(store);
