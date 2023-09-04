import type { Profile, Publication } from '@lenster/lens';
import { NewPublicationTypes } from 'src/enums';
import { create } from 'zustand';

interface GlobalModalState {
  showAuthModal: boolean;
  setShowAuthModal: (showAuthModal: boolean) => void;
  showComposerModal: boolean;
  modalPublicationType: NewPublicationTypes;
  setShowComposerModal: (
    showComposerModal: boolean,
    modalPublicationType: NewPublicationTypes
  ) => void;
  showDiscardModal: boolean;
  setShowDiscardModal: (showDiscardModal: boolean) => void;
  showStatusModal: boolean;
  setShowStatusModal: (showStatusModal: boolean) => void;
  showProfileSwitchModal: boolean;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  showMobileDrawer: boolean;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
  showInvitesModal: boolean;
  setShowInvitesModal: (showInvitesModal: boolean) => void;
  showPublicationReportModal: boolean;
  reportingPublication: Publication | null;
  setShowPublicationReportModal: (
    showPublicationReportModal: boolean,
    reportingPublication: Publication | null
  ) => void;
  showReportProfileModal: boolean;
  reportingProfile: Profile | null;
  setShowReportProfileModal: (
    reportProfileModal: boolean,
    reportingProfile: Profile | null
  ) => void;
}

export const useGlobalModalStateStore = create<GlobalModalState>((set) => ({
  showAuthModal: false,
  setShowAuthModal: (showAuthModal) => set(() => ({ showAuthModal })),
  showComposerModal: false,
  modalPublicationType: NewPublicationTypes.Publication,
  setShowComposerModal: (showComposerModal, modalPublicationType) =>
    set(() => ({ showComposerModal, modalPublicationType })),
  showDiscardModal: false,
  setShowDiscardModal: (showDiscardModal) => set(() => ({ showDiscardModal })),
  showPublicationReportModal: false,
  showStatusModal: false,
  setShowStatusModal: (showStatusModal) => set(() => ({ showStatusModal })),
  showProfileSwitchModal: false,
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  showMobileDrawer: false,
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  showInvitesModal: false,
  setShowInvitesModal: (showInvitesModal) => set(() => ({ showInvitesModal })),
  reportingPublication: null,
  setShowPublicationReportModal: (
    showPublicationReportModal,
    reportingPublication
  ) =>
    set(() => ({
      showPublicationReportModal,
      reportingPublication
    })),
  showReportProfileModal: false,
  reportingProfile: null,
  setShowReportProfileModal: (showReportProfileModal, reportingProfile) =>
    set(() => ({ showReportProfileModal, reportingProfile }))
}));
