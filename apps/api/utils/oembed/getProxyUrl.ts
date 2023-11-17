const directUrls = [
  'zora.co/api/thumbnail' // Zora
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

  return `${process.env.IMAGEKIT_URL}/tr:di-placeholder.webp,h-${height},w-${width}/${url}`;
};

export default getProxyUrl;
