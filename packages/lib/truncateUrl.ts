/**
 * Truncate a string by character length and add ellipsis.
 * @param url string to truncate
 * @param maxLength number of characters to truncate to
 * @returns truncated string
 */
const truncateUrl = (url: string, maxLength: number): string => {
  url = url.replace(/^(http|https):\/\//, '');
  url = url.replace(/^www\./, '');
  if (url.length > maxLength) {
    return url.substring(0, maxLength - 1) + '…';
  }
  return url;
};

export default truncateUrl;
