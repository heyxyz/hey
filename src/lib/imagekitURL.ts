import { IMAGEKIT_URL } from 'src/constants';

/**
 *
 * @param url - URL to be converted to ImageKit URL
 * @param name - Transformation name
 * @returns ImageKit URL
 */
const imagekitURL = (url: string, name?: string): string => {
  return name
    ? `${IMAGEKIT_URL}/tr:n-${name},tr:di-placeholder.webp/${url}`
    : `${IMAGEKIT_URL}/tr:di-placeholder.webp/${url}`;
};

export default imagekitURL;
