import { MusicTrack, TokenGateCondition } from 'src/enums';
import { create } from 'zustand';

export type TSidebarView = 'close' | 'peers';

interface SpacesState {
  showSpacesLobby: boolean;
  setShowSpacesLobby: (showSpacesLobby: boolean) => void;
  showSpacesWindow: boolean;
  setShowSpacesWindow: (showSpacesWindow: boolean) => void;
  spacesPublicationId: string;
  setSpacesPublicationId: (spacesPublicationId: string) => void;
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
  spacesStartTime: Date;
  setSpacesStartTime: (val: Date) => void;
  isAudioOn: boolean;
  setIsAudioOn: (val: boolean) => void;
  activeMicDevice: MediaDeviceInfo | null;
  setActiveMicDevice: (val: MediaDeviceInfo | null) => void;
  activeSpeakerDevice: MediaDeviceInfo | null;
  setActiveSpeakerDevice: (val: MediaDeviceInfo | null) => void;
}

export const useSpacesStore = create<SpacesState>((set, get) => ({
  showSpacesLobby: false,
  setShowSpacesLobby: (showSpacesLobby) => set(() => ({ showSpacesLobby })),
  showSpacesWindow: false,
  setShowSpacesWindow: (showSpacesWindow) => set(() => ({ showSpacesWindow })),
  spacesPublicationId: '',
  setSpacesPublicationId: (spacesPublicationId) =>
    set(() => ({ spacesPublicationId })),
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
  spacesStartTime: new Date(),
  setSpacesStartTime: (spacesStartTime) => set(() => ({ spacesStartTime })),
  isAudioOn: false,
  setIsAudioOn: (isAudioOn) => set(() => ({ isAudioOn })),
  activeMicDevice: null,
  setActiveMicDevice: (activeMicDevice) => set(() => ({ activeMicDevice })),
  activeSpeakerDevice: null,
  setActiveSpeakerDevice: (activeSpeakerDevice) =>
    set(() => ({ activeSpeakerDevice }))
}));
