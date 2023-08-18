import { create } from 'zustand';

export type TSidebarView = 'close' | 'peers';

export enum TokenGateCondition {
  HAVE_A_LENS_PROFILE = 'HAVE_PROFILE',
  FOLLOW_A_LENS_PROFILE = 'FOLLOW_PROFILE',
  COLLECT_A_POST = 'COLLECT_POST',
  MIRROR_A_POST = 'MIRROR_POST'
}

interface SpacesState {
  showSpacesLobby: boolean;
  setShowSpacesLobby: (showSpacesLobby: boolean) => void;
  showSpacesWindow: boolean;
  setShowSpacesWindow: (showSpacesWindow: boolean) => void;
  lensAccessToken: string;
  setLensAccessToken: (lensAccessToken: string) => void;
  isRecordingOn: boolean;
  setIsRecordingOn: (isRecordingOn: boolean) => void;
  isTokenGated: boolean;
  setIsTokenGated: (isTokenGated: boolean) => void;
  tokenGateConditionType: TokenGateCondition;
  setTokenGateConditionType: (
    tokenGateConditionType: TokenGateCondition
  ) => void;
  tokenGateConditionValue: string;
  setTokenGateConditionValue: (tokenGateConditionValue: string) => void;
  myReaction: string;
  setMyReaction: (myReaction: string) => void;
  space: {
    id: string;
    host: string;
    title: string;
  };
  setSpace: (space: { id: string; host: string; title: string }) => void;
  sidebar: {
    isSidebarOpen: boolean;
    sidebarView: TSidebarView;
  };
  setSidebarView: (val: TSidebarView) => void;
  isMyHandRaised: boolean;
  setMyHandRaised: (val: boolean) => void;
  requestedPeers: string[];
  addRequestedPeers: (val: string) => void;
  removeRequestedPeers: (val: string) => void;
}

export const useSpacesStore = create<SpacesState>((set, get) => ({
  showSpacesLobby: false,
  setShowSpacesLobby: (showSpacesLobby) => set(() => ({ showSpacesLobby })),
  showSpacesWindow: false,
  setShowSpacesWindow: (showSpacesWindow) => set(() => ({ showSpacesWindow })),
  lensAccessToken: '',
  setLensAccessToken: (lensAccessToken) => set(() => ({ lensAccessToken })),
  isRecordingOn: false,
  setIsRecordingOn: (isRecordingOn) => set(() => ({ isRecordingOn })),
  isTokenGated: false,
  setIsTokenGated: (isTokenGated) => set(() => ({ isTokenGated })),
  tokenGateConditionValue: '',
  setTokenGateConditionValue: (tokenGateConditionValue) =>
    set(() => ({ tokenGateConditionValue })),
  tokenGateConditionType: TokenGateCondition.HAVE_A_LENS_PROFILE,
  setTokenGateConditionType: (tokenGateConditionType) =>
    set(() => ({ tokenGateConditionType })),
  space: {
    id: '',
    host: '',
    title: ''
  },
  sidebar: {
    isSidebarOpen: false,
    sidebarView: 'close'
  },
  isMyHandRaised: false,
  requestedPeers: [],
  setSpace: (space) => set(() => ({ space })),
  setSidebarView(sidebarView: TSidebarView) {
    const prevView = get().sidebar.sidebarView;

    if (sidebarView === 'close' || sidebarView === prevView) {
      set(() => ({
        sidebar: {
          isSidebarOpen: false,
          sidebarView: 'close'
        }
      }));
    }

    set(() => ({
      sidebar: {
        isSidebarOpen: true,
        sidebarView
      }
    }));
  },
  setMyHandRaised: (isMyHandRaised) => set(() => ({ isMyHandRaised })),
  addRequestedPeers: (val: string) => {
    set((state) => ({
      requestedPeers: [...state.requestedPeers, val]
    }));
  },
  removeRequestedPeers: (peerId) =>
    set((state) => ({
      requestedPeers: state.requestedPeers.filter((id) => id !== peerId)
    })),
  myReaction: '',
  setMyReaction: (myReaction) => set(() => ({ myReaction }))
}));
