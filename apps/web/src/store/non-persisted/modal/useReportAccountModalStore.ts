import type { AccountFieldsFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showReportAccountModal: boolean;
  reportingAccount: null | AccountFieldsFragment;
  setShowReportAccountModal: (
    showReportAccountModal: boolean,
    reportingAccount: null | AccountFieldsFragment
  ) => void;
}

const store = create<State>((set) => ({
  showReportAccountModal: false,
  reportingAccount: null,
  setShowReportAccountModal: (showReportAccountModal, reportingAccount) =>
    set(() => ({ showReportAccountModal, reportingAccount }))
}));

export const useReportAccountModalStore = createTrackedSelector(store);
