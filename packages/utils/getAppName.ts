/**
 * Convert a given string to an app name format.
 *
 * @param str - The string to convert
 * @returns The string with the first letter capitalized and dashes replaced with spaces
 */
const getAppName = (str: string): string => {
  const firstLetter = str.charAt(0).toUpperCase();
  const restOfWord = str.slice(1).replace(/-/g, ' ');
  return `${firstLetter}${restOfWord}`;
};

export default getAppName;
