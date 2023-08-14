/**
 * Strip a url, truncate it to a given max length and add ellipsis if truncated.
 *
 * @param url url to truncate
 * @param maxLength number of characters to truncate to
 * @returns truncated url
 */
const truncateUrl = (url: string, maxLength: number): string => {
  let strippedUrl = url.replace(/^(http|https):\/\//, '').replace(/^www\./, '');
  try {
    if (strippedUrl !== url && new URL(url).hostname.endsWith('lenster.xyz')) {
      return strippedUrl;
    }
    if (strippedUrl.length > maxLength) {
      return strippedUrl.substring(0, maxLength - 1) + '…';
    }
    return strippedUrl;
  } catch (error: any) {
    return url;
  }
};

export default truncateUrl;
