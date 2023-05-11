import { URL_REGEX } from 'data';

/**
 * Returns an array of URLs found in the specified text.
 *
 * @param text The text to get URLs from.
 * @returns An array of URLs.
 */
const getURLs = (text: string): string[] => {
  if (!text) {
    return [];
  }

  return text.match(URL_REGEX) || [];
};

export default getURLs;
