/**
 * Returns an array of URLs found in the specified text.
 *
 * @param text The text to get URLs from.
 * @returns An array of URLs.
 */
const removeUrlAtEnd = (urls: string[], content: string): string => {
  if (urls && urls.length === 1) {
    const trimmedContent = content.trimEnd();
    const indexOfUrl = trimmedContent.indexOf(urls[0]);
    if (indexOfUrl === trimmedContent.length - urls[0].length) {
      return trimmedContent?.replace(urls[0], '');
    }

    return trimmedContent;
  }

  return content;
};

export default removeUrlAtEnd;
