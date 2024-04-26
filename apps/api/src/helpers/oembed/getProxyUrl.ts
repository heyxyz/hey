import { HEY_IMAGEKIT_URL } from '@hey/data/constants';

const directUrls = [
  'zora.co/api/thumbnail', // Zora
  'social-images.lu.ma', // Lu.ma
  'drips.network' // Drips
];

const getProxyUrl = (url: string, isLarge: boolean) => {
  if (!url) {
    return null;
  }

  const isDirect = directUrls.some((directUrl) => url.includes(directUrl));

  if (isDirect) {
    return url;
  }

  const isSquare = !isLarge;
  const height = isSquare ? 400 : 600;
  const width = isSquare ? 400 : 'auto';

  return `${HEY_IMAGEKIT_URL}/oembed/tr:di-placeholder.webp,h-${height},w-${width}/${url}`;
};

export default getProxyUrl;
