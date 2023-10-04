/**
 * Strip a url, truncate it to a given max length and add ellipsis if truncated.
 *
 * @param url url to truncate
 * @param maxLength number of characters to truncate to
 * @returns truncated url
 */
const truncateUrl = (url: string, maxLength: number): string => {
  let strippedUrl = url.replace(/^(http|https):\/\//, '').replace(/^www\./, '');

  /** now we are also allowing urls that don't have https or http or www
   * so this functions will try to give error becuse it will try to remove
   * https from url which don't contain it so here we need to modify fucntion */

  try {
    // Check if the URL is valid before creating a URL object
    new URL(url);
  } catch (error) {
    return strippedUrl;
  }

  if (strippedUrl.length > maxLength) {
    return strippedUrl.substring(0, maxLength - 1) + '…';
  }

  return strippedUrl;
};

export default truncateUrl;
