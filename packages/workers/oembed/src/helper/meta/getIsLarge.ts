import type { Document } from 'linkedom';

const getIsLarge = (document: Document): boolean | null => {
  const lens =
    document.querySelector('meta[name="lens:card"]') ||
    document.querySelector('meta[property="lens:card"]');
  const twitter =
    document.querySelector('meta[name="twitter:card"]') ||
    document.querySelector('meta[property="twitter:card"]');

  const largeTypes = ['summary_large_image', 'player'];

  if (lens) {
    const card = lens.getAttribute('content') || '';
    return largeTypes.includes(card);
  } else if (twitter) {
    const card = twitter.getAttribute('content') || '';
    return largeTypes.includes(card);
  }

  return null;
};

export default getIsLarge;
