import type { Document } from 'linkedom';

const getSite = (document: Document): null | string => {
  const lens =
    document.querySelector('meta[name="lens:site"]') ||
    document.querySelector('meta[property="lens:site"]');
  const og =
    document.querySelector('meta[name="og:site_name"]') ||
    document.querySelector('meta[property="og:site_name"]');
  const twitter =
    document.querySelector('meta[name="twitter:site"]') ||
    document.querySelector('meta[property="twitter:site"]');

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

export default getSite;
