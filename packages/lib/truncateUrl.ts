/**
 * Truncate a string by character length and add ellipsis.
 * @param string string to truncate
 * @param maxLength number of characters to truncate to
 * @returns truncated string
 */
const truncateUrl = (string: string, maxLength: number): string => {
  string = string.replace(/^(http|https):\/\//, '');
  string = string.replace(/^www\./, '');
  if (string.length > maxLength) {
    return string.substring(0, maxLength - 1) + '…';
  }
  return string;
};

export default truncateUrl;
