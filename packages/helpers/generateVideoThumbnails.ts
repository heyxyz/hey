import { PLACEHOLDER_IMAGE } from "@hey/data/constants";

const canvasImageFromVideo = (
  file: File,
  currentTime: number
): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      video.currentTime = currentTime;
    };
    video.oncanplay = () => {
      setTimeout(() => {
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        return resolve(canvas.toDataURL("image/png"));
      }, 100);
    };
  });
};

export const generateVideoThumbnails = (
  file: File,
  count: number
): Promise<string[]> => {
  return new Promise((resolve) => {
    try {
      if (!file.size) {
        return [];
      }
      // creating video element to get duration
      const video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
      video.onloadeddata = async () => {
        const thumbnailArray: string[] = [];
        const averageSplitTime = Math.floor(video.duration / count);
        for (let i = 0; i < count; i++) {
          const currentTime = averageSplitTime * i;
          const thumbnail = await canvasImageFromVideo(file, currentTime);
          thumbnailArray.push(thumbnail);
        }
        resolve(thumbnailArray);
      };
    } catch {
      resolve([]);
    }
  });
};

export const generateVideoThumbnail = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      video.src = url;
      video.currentTime = 0.01;
      video.muted = true;
      video.autoplay = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        video.oncanplay = () => {
          setTimeout(() => {
            const ctx = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            return resolve(canvas.toDataURL());
          }, 100);
        };
      };
    } catch {
      resolve(PLACEHOLDER_IMAGE);
    }
  });
};
