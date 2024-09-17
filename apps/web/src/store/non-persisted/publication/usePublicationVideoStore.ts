import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface VideoThumbnail {
  mimeType: string;
  uploading: boolean;
  url: string;
}

export const DEFAULT_VIDEO_THUMBNAIL: VideoThumbnail = {
  mimeType: "",
  uploading: false,
  url: ""
};

interface State {
  setUploadedPercentage: (uploadedPercentage: number) => void;
  setVideoDurationInSeconds: (videoDurationInSeconds: string) => void;
  setVideoThumbnail: (videoThumbnail: VideoThumbnail) => void;
  uploadedPercentage: number;
  videoDurationInSeconds: string;
  videoThumbnail: VideoThumbnail;
}

const store = create<State>((set) => ({
  setUploadedPercentage: (uploadedPercentage) =>
    set(() => ({ uploadedPercentage })),
  setVideoDurationInSeconds: (videoDurationInSeconds) =>
    set(() => ({ videoDurationInSeconds })),
  setVideoThumbnail: (videoThumbnail) => set(() => ({ videoThumbnail })),
  uploadedPercentage: 0,
  videoDurationInSeconds: "",
  videoThumbnail: DEFAULT_VIDEO_THUMBNAIL
}));

export const usePublicationVideoStore = createTrackedSelector(store);
