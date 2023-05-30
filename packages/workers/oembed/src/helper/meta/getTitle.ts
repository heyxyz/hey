import type { Document } from 'linkedom';

const getTitle = (document: Document): string | null => {
  const lens =
    document.querySelector('meta[name="lens:title"]') ||
    document.querySelector('meta[property="lens:title"]');
  const og =
    document.querySelector('meta[name="og:title"]') ||
    document.querySelector('meta[property="og:title"]');
  const twitter =
    document.querySelector('meta[name="twitter:title"]') ||
    document.querySelector('meta[property="twitter:title"]');

  if (lens) {
    return lens.getAttribute('content');
  } else if (og) {
    return og.getAttribute('content');
  } else if (twitter) {
    return twitter.getAttribute('content');
  }

  return null;
};

export default getTitle;
