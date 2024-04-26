import urlcat from 'urlcat';

/**
 * Get favicon from google
 * @param url The url to get the favicon from.
 * @returns The favicon url.
 */
const getFavicon = (url: string) => {
  const sanitizedUrl = url.replace('https://', '').replace('http://', '');

  return urlcat('https://www.google.com/s2/favicons', {
    domain: sanitizedUrl,
    sz: 128
  });
};

export default getFavicon;
