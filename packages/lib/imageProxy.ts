import { LENS_MEDIA_SNAPSHOT_URL, STATIC_ASSETS_URL } from 'data/constants';

/**
 * Returns a URL for the specified image that is compatible with imgproxy.
 *
 * @param url The original URL of the image.
 * @param name The transformation name (optional).
 * @returns A URL for the image that is compatible with imgproxy.
 */
const imageProxy = (url: string, name?: string): string => {
  if (!url) {
    return '';
  }

  if (url.includes(STATIC_ASSETS_URL)) {
    return url;
  }

  if (url.includes(LENS_MEDIA_SNAPSHOT_URL)) {
    const splitedUrl = url.split('/');
    const path = splitedUrl[splitedUrl.length - 1];

    return name ? `${LENS_MEDIA_SNAPSHOT_URL}/${name}/${path}` : url;
  }

  return url;
};

export default imageProxy;
