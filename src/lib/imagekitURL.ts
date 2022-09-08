import { IMAGEKIT_URL } from 'src/constants';

/**
 *
 * @param url - URL to be converted to ImageKit URL
 * @param name - Transformation name
 * @returns ImageKit URL
 */
const imagekitURL = (url: string, name?: string): string => {
  return name
    ? `${IMAGEKIT_URL}/tr:n-${name},pr-true,tr:di-placeholder.webp/${url}`
    : `${IMAGEKIT_URL}/pr-true,tr:di-placeholder.webp/${url}`;
};

export default imagekitURL;
