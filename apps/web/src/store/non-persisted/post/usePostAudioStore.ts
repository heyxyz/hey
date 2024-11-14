import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface AudioPublication {
  artist: string;
  cover: string;
  mimeType: string;
  title: string;
}

export const DEFAULT_AUDIO_POST: AudioPublication = {
  artist: "",
  cover: "",
  mimeType: "",
  title: ""
};

interface State {
  audioPost: AudioPublication;
  setAudioPost: (audioPost: AudioPublication) => void;
}

const store = create<State>((set) => ({
  audioPost: DEFAULT_AUDIO_POST,
  setAudioPost: (audioPost) => set(() => ({ audioPost }))
}));

export const usePostAudioStore = createTrackedSelector(store);
