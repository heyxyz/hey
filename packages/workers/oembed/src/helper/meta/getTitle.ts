import type { Document } from 'linkedom';

const getTitle = (document: Document): string | null => {
  const og = document.querySelector('meta[property="og:title"]');
  const twitter =
    document.querySelector('meta[name="twitter:title"]') ||
    document.querySelector('meta[property="twitter:title"]');
  const lenster = document.querySelector('meta[name="lenster:title"]');

  if (og) {
    return og.getAttribute('content');
  } else if (twitter) {
    return twitter.getAttribute('content');
  } else if (lenster) {
    return lenster.getAttribute('content');
  }

  return null;
};

export default getTitle;
