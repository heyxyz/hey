import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface PublicationAudioState {
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

const store = create<PublicationAudioState>((set) => ({
  audioPublication: {
    artist: '',
    cover: '',
    coverMimeType: 'image/jpeg',
    title: ''
  },
  setAudioPublication: (audioPublication) => set(() => ({ audioPublication }))
}));

export const usePublicationAudioStore = createTrackedSelector(store);
