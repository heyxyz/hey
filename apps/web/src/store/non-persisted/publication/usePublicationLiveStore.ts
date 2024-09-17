import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
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

const store = create<State>((set) => ({
  liveVideoConfig: { id: "", playbackId: "", streamKey: "" },
  resetLiveVideoConfig: () =>
    set(() => ({ liveVideoConfig: { id: "", playbackId: "", streamKey: "" } })),
  setLiveVideoConfig: (liveVideoConfig) => set(() => ({ liveVideoConfig })),
  setShowLiveVideoEditor: (showLiveVideoEditor) =>
    set(() => ({ showLiveVideoEditor })),
  showLiveVideoEditor: false
}));

export const usePublicationLiveStore = createTrackedSelector(store);
