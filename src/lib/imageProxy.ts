import { IMAGEKIT_URL, IMGPROXY_URL } from 'src/constants';

/**
 *
 * @param url - URL to be converted to imgproxy URL
 * @param name - Transformation name
 * @param type - Media type
 * @returns imgproxy URL
 */
const imageProxy = (url: string, size?: string, type?: string): string => {
  const base64ofUrl = Buffer.from(url, 'utf8').toString('base64');

  if (type === 'image/gif') {
    return `${IMAGEKIT_URL}/tr:h-attachment,tr:di-placeholder.webp/${url}`;
  }

  return size
    ? `${IMGPROXY_URL}/sig/size:${size}/${base64ofUrl}.webp`
    : `${IMGPROXY_URL}/sig/${base64ofUrl}.webp`;
};

export default imageProxy;
