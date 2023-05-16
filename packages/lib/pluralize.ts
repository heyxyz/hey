/**
 * Pluralize a word based on a count.
 * @param word The word to pluralize.
 * @param count The count to base the pluralization on.
 * @returns The pluralized word.
 */
const pluralize = (word: string, count: number): string => {
  if (count === 1) {
    return word;
  } else {
    return word + 's';
  }
};

export default pluralize;
