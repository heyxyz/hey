import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showReportPostModal: boolean;
  reportingPostId: null | string;
  setShowReportPostModal: (
    showReportPostModal: boolean,
    reportingPostId: null | string
  ) => void;
}

const store = create<State>((set) => ({
  showReportPostModal: false,
  reportingPostId: null,
  setShowReportPostModal: (showReportPostModal, reportingPostId) =>
    set(() => ({ showReportPostModal, reportingPostId }))
}));

export const useReportPostModalStore = createTrackedSelector(store);
