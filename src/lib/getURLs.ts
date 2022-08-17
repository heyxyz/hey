/**
 *
 * @param text - Text to get URLs from
 * @returns urls
 */
const getURLs = (text: string) => {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.match(urlRegex) ?? [];
};

export default getURLs;
