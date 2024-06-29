import urlcat from 'urlcat';

/**
 * Get favicon from google
 * @param url The url to get the favicon from.
 * @returns The favicon url.
 */
const getFavicon = (url: string) => {
  const sanitizedUrl = url.replace('https://', '').replace('http://', '');

  return urlcat('https://external-content.duckduckgo.com/ip3/:domain.ico', {
    domain: sanitizedUrl
  });
};

export default getFavicon;
