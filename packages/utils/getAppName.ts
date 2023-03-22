/**
 *
 * @param str the string to convert
 * @returns the string with the first letter capitalized and dashes replaced with spaces
 */
const getAppName = (str: string): string => {
  const firstLetter = str.charAt(0).toUpperCase();
  const restOfWord = str.slice(1).replace(/-/g, ' ');
  return `${firstLetter}${restOfWord}`;
};

export default getAppName;
