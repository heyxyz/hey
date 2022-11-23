import { IMGPROXY_URL } from 'data/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, name?: string): string => {
  return name
    ? `${IMGPROXY_URL}/tr:n-${name},tr:di-placeholder.webp/${url}`
    : `${IMGPROXY_URL}/tr:di-placeholder.webp/${url}`;
};

export default imageProxy;
