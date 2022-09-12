/**
 *
 * @param text - Text to get URLs from
 * @returns urls
 */
const getURLs = (text: string) => {
  const urlRegex = /(((https?:\/\/)|(www\.))\S+)/g;
  return text.match(urlRegex) ?? [];
};

export default getURLs;
