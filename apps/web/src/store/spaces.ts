import { MusicTrack, TokenGateCondition } from 'src/enums';
import { create } from 'zustand';

export type TSidebarView = 'close' | 'peers';

interface SpacesState {
  showSpacesLobby: boolean;
  setShowSpacesLobby: (showSpacesLobby: boolean) => void;
  showSpacesWindow: boolean;
  setShowSpacesWindow: (showSpacesWindow: boolean) => void;
  lensAccessToken: string;
  setLensAccessToken: (lensAccessToken: string) => void;
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
}

export const useSpacesStore = create<SpacesState>((set, get) => ({
  showSpacesLobby: false,
  setShowSpacesLobby: (showSpacesLobby) => set(() => ({ showSpacesLobby })),
  showSpacesWindow: false,
  setShowSpacesWindow: (showSpacesWindow) => set(() => ({ showSpacesWindow })),
  lensAccessToken: '',
  setLensAccessToken: (lensAccessToken) => set(() => ({ lensAccessToken })),
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
  setSpacesTimeInHour: (spacesTimeInHour) => set(() => ({ spacesTimeInHour })),
  spacesTimeInMinute: '00',
  setSpacesTimeInMinute: (spacesTimeInMinute) =>
    set(() => ({ spacesTimeInMinute })),
  isSpacesTimeInAM: true
}));
