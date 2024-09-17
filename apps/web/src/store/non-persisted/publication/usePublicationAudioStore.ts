import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface AudioPublication {
  artist: string;
  cover: string;
  mimeType: string;
  title: string;
}

export const DEFAULT_AUDIO_PUBLICATION: AudioPublication = {
  artist: "",
  cover: "",
  mimeType: "",
  title: ""
};

interface State {
  audioPublication: AudioPublication;
  setAudioPublication: (audioPublication: AudioPublication) => void;
}

const store = create<State>((set) => ({
  audioPublication: DEFAULT_AUDIO_PUBLICATION,
  setAudioPublication: (audioPublication) => set(() => ({ audioPublication }))
}));

export const usePublicationAudioStore = createTrackedSelector(store);
