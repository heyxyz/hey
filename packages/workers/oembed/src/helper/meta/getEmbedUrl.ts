import type { Document } from 'linkedom';

const getEmbedUrl = (document: Document): string | null => {
  const og =
    document.querySelector('meta[property="og:video:url"]') ||
    document.querySelector('meta[property="og:video:secure_url"]');
  const twitter =
    document.querySelector('meta[name="twitter:player"]') ||
    document.querySelector('meta[property="twitter:player"]');

  if (og) {
    return og.getAttribute('content');
  } else if (twitter) {
    return twitter.getAttribute('content');
  }

  return null;
};

export default getEmbedUrl;
