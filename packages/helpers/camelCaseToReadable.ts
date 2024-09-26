/**
 * Converts a camel case string to a readable string.
 * @param text The camel case string to convert.
 * @returns The readable string.
 */
const camelCaseToReadable = (text: string): string => {
  const result = text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

  return result;
};

export default camelCaseToReadable;
