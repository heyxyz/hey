/**
 * Returns true if the specified text contains the "gm" tag, ignoring case and word boundaries.
 * @param inputText - The text to check.
 * @returns True if the text contains the "gm" tag, false otherwise.
 */
const hasGm = (inputText: string): boolean => {
  const regex = /\bgm\b/i;
  return regex.test(inputText);
};

export default hasGm;
