import { HANDLE_MATCHER_REGEX, HANDLE_SUFFIX } from 'data/constants';

/**
 *
 * @param str - Complete string
 * @param pattern - pattern to match
 * @returns index,length and match of matched string
 */
const match = (str: string, pattern: any) => {
  const matches = str.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i'));
  if (!matches) {
    return null;
  }
  return { index: matches.index, length: matches[0].length, match: matches[0] };
};

/**
 *
 * @param content - Complete content
 * @returns content with all mentions suffix .lens or .test
 */
const formatContentWithMentions = (content: string): string => {
  let currentContent = content;
  let matchedContent = '';
  let matcher = null;

  while (currentContent && (matcher = match(currentContent, HANDLE_MATCHER_REGEX))) {
    const { index, length, match } = matcher;
    if (typeof index === 'number') {
      let mention = match;
      if (!match.endsWith(HANDLE_SUFFIX)) {
        mention += HANDLE_SUFFIX;
      }
      matchedContent += currentContent.slice(0, index) + mention;
      currentContent = currentContent.slice(index + length, currentContent.length);
    }
  }
  return matchedContent + currentContent;
};

export default formatContentWithMentions;
