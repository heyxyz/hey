import type { Document } from 'linkedom';

const getIsLarge = (document: Document): boolean | null => {
  const twitter =
    document.querySelector('meta[name="twitter:card"]') ||
    document.querySelector('meta[property="twitter:card"]');
  const lenster = document.querySelector('meta[name="lenster:card"]');

  const largeTypes = ['summary_large_image', 'player'];

  if (twitter) {
    const card = twitter.getAttribute('content') || '';
    return largeTypes.includes(card);
  } else if (lenster) {
    const card = lenster.getAttribute('content') || '';
    return largeTypes.includes(card);
  }

  return null;
};

export default getIsLarge;
