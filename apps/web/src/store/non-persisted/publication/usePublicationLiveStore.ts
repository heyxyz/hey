import { create } from 'zustand';

interface PublicationLiveState {
  liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  };
  resetLiveVideoConfig: () => void;
  setLiveVideoConfig: (liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  }) => void;
  setShowLiveVideoEditor: (showLiveVideoEditor: boolean) => void;
  showLiveVideoEditor: boolean;
}

export const usePublicationLiveStore = create<PublicationLiveState>((set) => ({
  liveVideoConfig: { id: '', playbackId: '', streamKey: '' },
  resetLiveVideoConfig: () =>
    set(() => ({ liveVideoConfig: { id: '', playbackId: '', streamKey: '' } })),
  setLiveVideoConfig: (liveVideoConfig) => set(() => ({ liveVideoConfig })),
  setShowLiveVideoEditor: (showLiveVideoEditor) =>
    set(() => ({ showLiveVideoEditor })),
  showLiveVideoEditor: false
}));
