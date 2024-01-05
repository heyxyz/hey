import { create } from 'zustand';

interface PublicationVideoState {
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

export const usePublicationVideoStore = create<PublicationVideoState>(
  (set) => ({
    setUploadedPercentage: (uploadedPercentage) =>
      set(() => ({ uploadedPercentage })),
    setVideoDurationInSeconds: (videoDurationInSeconds) =>
      set(() => ({ videoDurationInSeconds })),
    setVideoThumbnail: (videoThumbnail) => set(() => ({ videoThumbnail })),
    uploadedPercentage: 0,
    videoDurationInSeconds: '',
    videoThumbnail: { type: '', uploading: false, url: '' }
  })
);
