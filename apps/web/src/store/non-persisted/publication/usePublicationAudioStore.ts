import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  audioPublication: {
    artist: string;
    cover: string;
    coverMimeType: string;
    title: string;
  };
  setAudioPublication: (audioPublication: {
    artist: string;
    cover: string;
    coverMimeType: string;
    title: string;
  }) => void;
}

const store = create<State>((set) => ({
  audioPublication: {
    artist: '',
    cover: '',
    coverMimeType: 'image/jpeg',
    title: ''
  },
  setAudioPublication: (audioPublication) => set(() => ({ audioPublication }))
}));

export const usePublicationAudioStore = createTrackedSelector(store);
