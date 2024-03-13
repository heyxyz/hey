import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  setUploadedPercentage: (uploadedPercentage: number) => void;
  setVideoDurationInSeconds: (videoDurationInSeconds: string) => void;
  setVideoThumbnail: (videoThumbnail: {
    type?: string;
    uploading?: boolean;
    url?: string;
  }) => void;
  uploadedPercentage: number;
  videoDurationInSeconds: string;
  videoThumbnail: {
    type?: string;
    uploading?: boolean;
    url?: string;
  };
}

const store = create<State>((set) => ({
  setUploadedPercentage: (uploadedPercentage) =>
    set(() => ({ uploadedPercentage })),
  setVideoDurationInSeconds: (videoDurationInSeconds) =>
    set(() => ({ videoDurationInSeconds })),
  setVideoThumbnail: (videoThumbnail) => set(() => ({ videoThumbnail })),
  uploadedPercentage: 0,
  videoDurationInSeconds: '',
  videoThumbnail: { type: '', uploading: false, url: '' }
}));

export const usePublicationVideoStore = createTrackedSelector(store);
