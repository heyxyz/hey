import { IMAGEKIT_URL } from 'src/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, name?: string): string => {
  return name
    ? `${IMAGEKIT_URL}/tr:n-${name},tr:di-placeholder.webp/${url}`
    : `${IMAGEKIT_URL}/tr:di-placeholder.webp/${url}`;
};

export default imageProxy;
