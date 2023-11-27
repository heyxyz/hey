import type { Document } from 'linkedom';

const getImage = (document: Document): string | null => {
  const lens =
    document.querySelector('meta[name="lens:image"]') ||
    document.querySelector('meta[property="lens:image"]');
  const og =
    document.querySelector('meta[name="og:image"]') ||
    document.querySelector('meta[property="og:image"]');
  const twitter =
    document.querySelector('meta[name="twitter:image"]') ||
    document.querySelector('meta[name="twitter:image:src"]') ||
    document.querySelector('meta[property="twitter:image"]') ||
    document.querySelector('meta[property="twitter:image:src"]');

  if (lens) {
    return lens.getAttribute('content');
  } else if (og) {
    return og.getAttribute('content');
  } else if (twitter) {
    return twitter.getAttribute('content');
  }

  return null;
};

export default getImage;
