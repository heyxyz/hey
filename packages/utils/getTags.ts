/**
 * Extracts up to five unique hashtags from the specified input text.
 * @param inputText - The text to extract tags from.
 * @returns An array of up to five unique hashtags without the '#' symbol or surrounding whitespace.
 */
const getTags = (inputText: string): string[] => {
  const regex = /(?:^|\s)#([\dA-Za-z]+)/gm;
  const matches = inputText.match(regex)?.map((tag) => tag.trim().slice(1)) ?? [];
  const uniqueTags = [...new Set(matches)];
  return uniqueTags.slice(0, 5);
};

export default getTags;
