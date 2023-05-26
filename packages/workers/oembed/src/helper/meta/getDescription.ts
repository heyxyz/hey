import type { Document } from 'linkedom';

const getDescription = (document: Document): string | null => {
  const og = document.querySelector('meta[property="og:description"]');
  const twitter =
    document.querySelector('meta[name="twitter:description"]') ||
    document.querySelector('meta[property="twitter:description"]');
  const lenster = document.querySelector('meta[name="lenster:description"]');

  if (og) {
    return og.getAttribute('content');
  } else if (twitter) {
    return twitter.getAttribute('content');
  } else if (lenster) {
    return lenster.getAttribute('content');
  }

  return null;
};

export default getDescription;
