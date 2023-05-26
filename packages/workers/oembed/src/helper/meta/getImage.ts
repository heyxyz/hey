import type { Document } from 'linkedom';

const getImage = (document: Document): string | null => {
  const og = document.querySelector('meta[property="og:image"]');
  const twitter =
    document.querySelector('meta[name="twitter:image"]') ||
    document.querySelector('meta[name="twitter:image:src"]') ||
    document.querySelector('meta[property="twitter:image"]') ||
    document.querySelector('meta[property="twitter:image:src"]');
  const lenster = document.querySelector('meta[name="lenster:image"]');

  if (og) {
    return og.getAttribute('content');
  } else if (twitter) {
    return twitter.getAttribute('content');
  } else if (lenster) {
    return lenster.getAttribute('content');
  }

  return null;
};

export default getImage;
