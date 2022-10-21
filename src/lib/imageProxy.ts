import { IMGPROXY_URL } from 'src/constants';

/**
 *
 * @param url - URL to be converted to ImageKit URL
 * @param name - Transformation name
 * @returns ImageKit URL
 */
const imageProxy = (url: string, size?: string): string => {
  return size
    ? `${IMGPROXY_URL}/sig/size:${size}/${btoa(url)}.webp`
    : `${IMGPROXY_URL}/sig/${btoa(url)}.webp`;
};

export default imageProxy;
