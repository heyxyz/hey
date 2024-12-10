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
  setVideoDurationInSeconds: (videoDurationInSeconds: string) => void;
  setVideoThumbnail: (videoThumbnail: VideoThumbnail) => void;
  videoDurationInSeconds: string;
  videoThumbnail: VideoThumbnail;
}

const store = create<State>((set) => ({
  setVideoDurationInSeconds: (videoDurationInSeconds) =>
    set(() => ({ videoDurationInSeconds })),
  setVideoThumbnail: (videoThumbnail) => set(() => ({ videoThumbnail })),
  videoDurationInSeconds: "",
  videoThumbnail: DEFAULT_VIDEO_THUMBNAIL
}));

export const usePostVideoStore = createTrackedSelector(store);
