import type { Publication } from 'lens';
import { create } from 'zustand';

interface GlobalModalState {
  showReportModal: boolean;
  reportingPublication: Publication | null;
  reportConfig: any;
  setShowReportModal: (
    showReportModal: boolean,
    reportingPublication: Publication | null,
    reportConfig?: any
  ) => void;
  showStatusModal: boolean;
  setShowStatusModal: (showStatusModal: boolean) => void;
  showProfileSwitchModal: boolean;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  showMobileDrawer: boolean;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
}

export const useGlobalModalStateStore = create<GlobalModalState>((set) => ({
  showReportModal: false,
  reportingPublication: null,
  reportConfig: null,
  setShowReportModal: (showReportModal, reportingPublication, reportConfig) =>
    set(() => ({ showReportModal, reportingPublication, reportConfig })),
  showStatusModal: false,
  setShowStatusModal: (showStatusModal) => set(() => ({ showStatusModal })),
  showProfileSwitchModal: false,
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  showMobileDrawer: false,
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer }))
}));
