import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface AudioPost {
  artist: string;
  cover: string;
  mimeType: string;
  title: string;
}

export const DEFAULT_AUDIO_POST: AudioPost = {
  artist: "",
  cover: "",
  mimeType: "",
  title: ""
};

interface State {
  audioPost: AudioPost;
  setAudioPost: (audioPost: AudioPost) => void;
}

const store = create<State>((set) => ({
  audioPost: DEFAULT_AUDIO_POST,
  setAudioPost: (audioPost) => set(() => ({ audioPost }))
}));

export const usePostAudioStore = createTrackedSelector(store);
