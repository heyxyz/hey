import { MEDIA_PROXY_URL } from 'data/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, name?: string): string => {
  return name ? `${MEDIA_PROXY_URL}/?name=${name}&image=${url}` : `${MEDIA_PROXY_URL}/?image=${url}`;
};

export default imageProxy;
