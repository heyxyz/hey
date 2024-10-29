import {
  HEY_IMAGEKIT_URL,
  IPFS_GATEWAY,
  LENS_MEDIA_SNAPSHOT_URL
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

  if (url.includes(IPFS_GATEWAY)) {
    return name ? `${HEY_IMAGEKIT_URL}/fallback/${name}/${url}` : url;
  }

  return url;
};

export default imageKit;
