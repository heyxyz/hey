import type { Document } from 'linkedom';

const getEmbedUrl = (document: Document): null | string => {
  const lens =
    document.querySelector('meta[name="lens:player"]') ||
    document.querySelector('meta[property="lens:player"]');
  const og =
    document.querySelector('meta[name="og:video:url"]') ||
    document.querySelector('meta[name="og:video:secure_url"]') ||
    document.querySelector('meta[property="og:video:url"]') ||
    document.querySelector('meta[property="og:video:secure_url"]');
  const spotify =
    document.querySelector('meta[name="al:android:url"]') ||
    document.querySelector('meta[property="al:android:url"]');
  const twitter =
    document.querySelector('meta[name="twitter:player"]') ||
    document.querySelector('meta[property="twitter:player"]');

  if (lens) {
    return lens.getAttribute('content');
  }

  if (og) {
    return og.getAttribute('content');
  }

  if (spotify) {
    return spotify.getAttribute('content');
  }

  if (twitter) {
    return twitter.getAttribute('content');
  }

  return null;
};

export default getEmbedUrl;
