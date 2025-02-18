import {
  HEY_IMAGEKIT_URL,
  LENS_MEDIA_SNAPSHOT_URL,
  STORAGE_NODE_URL
} from "@hey/data/constants";

/**
 * Transforms the URL of an image to use ImageKit.
 *
 * @param url The original URL of the image.
 * @param name The transformation name (optional).
 * @returns A transformed URL.
 */
const imageKit = (url: string, name?: string): string => {
  if (!url) {
    return "";
  }

  if (url.includes(LENS_MEDIA_SNAPSHOT_URL)) {
    const splitedUrl = url.split("/");
    const path = splitedUrl[splitedUrl.length - 1];

    return name ? `${LENS_MEDIA_SNAPSHOT_URL}/${name}/${path}` : url;
  }

  if (url.includes(STORAGE_NODE_URL)) {
    return name ? `${HEY_IMAGEKIT_URL}/fallback/${name}/${url}` : url;
  }

  return url;
};

export default imageKit;
