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

  const urlRegex = /(((https?:\/\/)|(www\.))\S+)/g;
  return text.match(urlRegex) || [];
};

export default getURLs;
