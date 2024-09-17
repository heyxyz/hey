/**
 * Convert the input string by capitalizing the first letter and replacing dashes with spaces.
 *
 * @param str The string to convert
 * @returns The string with the first letter capitalized and dashes replaced with spaces
 */
const getAppName = (str: string): string => {
  if (!str) {
    return "";
  }

  const initCase = str.charAt(0).toUpperCase() + str.slice(1);
  return initCase.replace(/-/g, " ");
};

export default getAppName;
