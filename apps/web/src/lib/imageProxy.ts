import { MEDIA_PROXY_URL } from 'data/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, name?: string): string => {
  return name
    ? `${MEDIA_PROXY_URL}/tr:n-${name},tr:di-placeholder.webp/${url}`
    : `${MEDIA_PROXY_URL}/tr:di-placeholder.webp/${url}`;
};

export default imageProxy;
