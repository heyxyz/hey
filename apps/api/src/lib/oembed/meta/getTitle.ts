import type { Document } from 'linkedom';

const getTitle = (document: Document): null | string => {
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
  }

  if (og) {
    return og.getAttribute('content');
  }

  if (twitter) {
    return twitter.getAttribute('content');
  }

  return null;
};

export default getTitle;
