import { create } from 'zustand';

export type TSidebarView = 'close' | 'peers';

export enum TokenGateCondition {
  HAVE_A_LENS_PROFILE = 'HAVE_PROFILE',
  FOLLOW_A_LENS_PROFILE = 'FOLLOW_PROFILE',
  COLLECT_A_POST = 'COLLECT_POST',
  MIRROR_A_POST = 'MIRROR_POST'
}

export enum MusicTrack {
  DEFAULT = 'DEFAULT',
  CALM_MY_MIND = 'CALM_MY_MIND',
  CRADLE_OF_SOUL = 'CRADLE_OF_SOUL',
  FOREST_LULLABY = 'FOREST_LULLABY'
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
  myMusicTrack: MusicTrack;
  setMyMusicTrack: (val: MusicTrack) => void;
  isMyMusicPlaying: boolean;
  setIsMyMusicPlaying: (val: boolean) => void;
  requestedPeers: string[];
  addRequestedPeers: (val: string) => void;
  removeRequestedPeers: (val: string) => void;
  spacesTimeInHour: string;
  setSpacesTimeInHour: (val: string) => void;
  spacesTimeInMinute: string;
  setSpacesTimeInMinute: (val: string) => void;
  isSpacesTimeInAM: boolean;
  setIsSpacesTimeInAM: (val: boolean) => void;
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
  myMusicTrack: MusicTrack.DEFAULT,
  setMyMusicTrack: (myMusicTrack) => set(() => ({ myMusicTrack })),
  isMyMusicPlaying: false,
  setIsMyMusicPlaying: (isMyMusicPlaying) => set(() => ({ isMyMusicPlaying })),
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
  setMyReaction: (myReaction) => set(() => ({ myReaction })),
  spacesTimeInHour: '00',
  setSpacesTimeInHour: (val) => set(() => ({ spacesTimeInHour: val })),
  spacesTimeInMinute: '00',
  setSpacesTimeInMinute: (val) => set(() => ({ spacesTimeInMinute: val })),
  isSpacesTimeInAM: true,
  setIsSpacesTimeInAM: (val) => set(() => ({ isSpacesTimeInAM: val }))
}));
