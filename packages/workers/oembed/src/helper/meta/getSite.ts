import type { Document } from 'linkedom';

const getSite = (document: Document): string | null => {
  const og = document.querySelector('meta[property="og:site_name"]');
  const twitter =
    document.querySelector('meta[name="twitter:site"]') ||
    document.querySelector('meta[property="twitter:site"]');

  if (og) {
    return og.getAttribute('content');
  } else if (twitter) {
    return twitter.getAttribute('content');
  }

  return null;
};

export default getSite;
