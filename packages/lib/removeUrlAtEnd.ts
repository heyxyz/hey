/**
 * Returns an array of URLs found in the specified text.
 *
 * @param text The text to get URLs from.
 * @returns An array of URLs.
 */
const removeUrlAtEnd = (urls: string[], content: string): string => {
  if (urls && urls.length === 1) {
    let indexOfUrl = content.indexOf(urls[0]);
    if (indexOfUrl === content.length - urls[0].length) {
      return content?.replace(urls[0], '');
    } else {
      return content;
    }
  } else {
    return content;
  }
};

export default removeUrlAtEnd;
