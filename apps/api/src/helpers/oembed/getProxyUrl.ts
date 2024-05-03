import { HEY_IMAGEKIT_URL } from '@hey/data/constants';

const directUrls = [
  'zora.co/api/thumbnail', // Zora
  'social-images.lu.ma', // Lu.ma
  'drips.network' // Drips
];

const getProxyUrl = (url: string) => {
  if (!url) {
    return null;
  }

  const isDirect = directUrls.some((directUrl) => url.includes(directUrl));

  if (isDirect) {
    return url;
  }

  return `${HEY_IMAGEKIT_URL}/oembed/tr:di-placeholder.webp,h-400,w-400/${url}`;
};

export default getProxyUrl;
