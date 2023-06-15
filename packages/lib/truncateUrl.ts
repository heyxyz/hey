/**
 * Truncate a string by character length and add ellipsis.
 * @param url string to truncate
 * @param maxLength number of characters to truncate to
 * @returns truncated string
 */
const truncateUrl = (url: string, maxLength: number): string => {
  let strippedUrl = url.replace(/^(http|https):\/\//, '').replace(/^www\./, '');
  if (new URL(url).hostname.endsWith('lenster.xyz')) {
    return strippedUrl;
  }
  if (strippedUrl.length > maxLength) {
    return strippedUrl.substring(0, maxLength - 1) + '…';
  }
  return strippedUrl;
};

export default truncateUrl;
