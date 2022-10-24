import { IMGPROXY_URL } from 'src/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @returns imgproxy URL
 */
const imageProxy = (url: string, size?: string): string => {
  const base64ofUrl = Buffer.from(url, 'utf8').toString('base64');
  return size
    ? `${IMGPROXY_URL}/sig/size:${size}/${base64ofUrl}.webp`
    : `${IMGPROXY_URL}/sig/${base64ofUrl}.webp`;
};

export default imageProxy;
