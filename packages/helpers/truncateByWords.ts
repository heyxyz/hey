/**
 * Truncate a string by words and add ellipsis.
 * @param string string to truncate
 * @param count number of words to truncate to
 * @returns truncated string
 */
const truncateByWords = (string: string, count: number): string => {
  const strArr = string.split(" ");
  if (strArr.length > count) {
    return `${strArr.slice(0, count).join(" ")}…`;
  }
  return string;
};

export default truncateByWords;
