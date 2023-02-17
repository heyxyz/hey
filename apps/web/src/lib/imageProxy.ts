import { USER_CONTENT_URL } from 'data/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, name?: string): string => {
  return name ? `${USER_CONTENT_URL}/${name}/${url}` : `${USER_CONTENT_URL}/${url}`;
};

export default imageProxy;
