/**
 *
 * @param str the string to convert
 * @returns the string with the first letter capitalized and dashes replaced with spaces
 */
const getAppName = (str: string): string => {
  const initCase = str.charAt(0).toUpperCase() + str.slice(1);
  return initCase.replace(/-/g, ' ');
};

export default getAppName;
