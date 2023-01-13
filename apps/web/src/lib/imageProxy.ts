import { MEDIA_PROXY_URL } from 'data/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, name?: string): string => {
  return name ? `${MEDIA_PROXY_URL}/tr:n-${name}/${url}` : `${MEDIA_PROXY_URL}/${url}`;
};

export default imageProxy;
