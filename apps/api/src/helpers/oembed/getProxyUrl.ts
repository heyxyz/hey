import { GOOD_IMAGEKIT_URL } from '@good/data/constants';

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

  return `${GOOD_IMAGEKIT_URL}/oembed/tr:di-placeholder.webp,h-400,w-400/${url}`;
};

export default getProxyUrl;
