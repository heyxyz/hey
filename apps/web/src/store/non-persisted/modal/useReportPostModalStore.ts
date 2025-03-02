import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showReportPostModal: boolean;
  reportingPostId?: string;
  setShowReportPostModal: (
    showReportPostModal: boolean,
    reportingPostId?: string
  ) => void;
}

const store = create<State>((set) => ({
  showReportPostModal: false,
  reportingPostId: undefined,
  setShowReportPostModal: (showReportPostModal, reportingPostId) =>
    set(() => ({ showReportPostModal, reportingPostId }))
}));

export const useReportPostModalStore = createTrackedSelector(store);
