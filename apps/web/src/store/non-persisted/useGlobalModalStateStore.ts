import type { Profile } from '@hey/lens';

import { create } from 'zustand';

interface GlobalModalState {
  reportingProfile: null | Profile;
  reportingPublicationId: null | string;
  setShowAuthModal: (showAuthModal: boolean) => void;
  setShowDiscardModal: (showDiscardModal: boolean) => void;
  setShowInvitesModal: (showInvitesModal: boolean) => void;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
  setShowProfileSwitchModal: (showProfileSwitchModal: boolean) => void;
  setShowPublicationReportModal: (
    showPublicationReportModal: boolean,
    reportingPublicationId: null | string
  ) => void;
  setShowPublicationStatsModal: (
    showPublicationStatsModal: boolean,
    statsPublicationId: null | string
  ) => void;
  setShowReportProfileModal: (
    reportProfileModal: boolean,
    reportingProfile: null | Profile
  ) => void;
  setShowWrongNetworkModal: (showWrongNetworkModal: boolean) => void;
  showAuthModal: boolean;
  showDiscardModal: boolean;
  showInvitesModal: boolean;
  showMobileDrawer: boolean;
  showNewPostModal: boolean;
  showProfileSwitchModal: boolean;
  showPublicationReportModal: boolean;
  showPublicationStatsModal: boolean;
  showReportProfileModal: boolean;
  showWrongNetworkModal: boolean;
  statsPublicationId: null | string;
}

export const useGlobalModalStateStore = create<GlobalModalState>((set) => ({
  reportingProfile: null,
  reportingPublicationId: null,
  setShowAuthModal: (showAuthModal) => set(() => ({ showAuthModal })),
  setShowDiscardModal: (showDiscardModal) => set(() => ({ showDiscardModal })),
  setShowInvitesModal: (showInvitesModal) => set(() => ({ showInvitesModal })),
  setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer })),
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  setShowProfileSwitchModal: (showProfileSwitchModal) =>
    set(() => ({ showProfileSwitchModal })),
  setShowPublicationReportModal: (
    showPublicationReportModal,
    reportingPublicationId
  ) =>
    set(() => ({
      reportingPublicationId,
      showPublicationReportModal
    })),
  setShowPublicationStatsModal: (
    showPublicationStatsModal,
    statsPublicationId
  ) =>
    set(() => ({
      showPublicationStatsModal,
      statsPublicationId
    })),
  setShowReportProfileModal: (showReportProfileModal, reportingProfile) =>
    set(() => ({ reportingProfile, showReportProfileModal })),
  setShowWrongNetworkModal: (showWrongNetworkModal) =>
    set(() => ({ showWrongNetworkModal })),
  showAuthModal: false,
  showDiscardModal: false,
  showInvitesModal: false,
  showMobileDrawer: false,
  showNewPostModal: false,
  showProfileSwitchModal: false,
  showPublicationReportModal: false,
  showPublicationStatsModal: false,
  showReportProfileModal: false,
  showWrongNetworkModal: false,
  statsPublicationId: null
}));
