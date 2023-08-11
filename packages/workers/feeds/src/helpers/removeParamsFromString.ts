/**
 * Removes the query params from a string
 * @param inputString The string to remove the query params from
 * @returns The string without the query params
 */
const removeParamsFromString = (inputString: string): string => {
  const indexOfQuestionMark = inputString.indexOf('?');
  if (indexOfQuestionMark !== -1) {
    return inputString.slice(0, indexOfQuestionMark);
  }
  return inputString;
};

export default removeParamsFromString;
