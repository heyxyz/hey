import type { LensterPublication } from '@generated/types';
import { create } from 'zustand';

interface GlobalModalState {
  showReportModal: boolean;
  reportPublication: LensterPublication | null;
  reportConfig: any;
  setShowReportModal: (
    showReportModal: boolean,
    reportPublication: LensterPublication | null,
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
  reportPublication: null,
  reportConfig: null,
  setShowReportModal: (showReportModal, reportPublication, reportConfig) =>
    set(() => ({ showReportModal, reportPublication, reportConfig })),
  showStatusModal: false,
  setShowStatusModal: (showStatusModal) => set(() => ({ showStatusModal })),
  showProfileSwitchModal: false,
  setShowProfileSwitchModal: (showProfileSwitchModal) => set(() => ({ showProfileSwitchModal })),
  showMobileDrawer: false,
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer }))
}));
