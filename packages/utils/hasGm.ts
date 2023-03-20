/**
 *
 * @param inputText the text to check for the gm tag
 * @returns true if the text contains the gm tag
 */
const hasGm = (inputText: string) => {
  const regex = /\bgm\b/gi;

  return regex.test(inputText);
};

export default hasGm;
