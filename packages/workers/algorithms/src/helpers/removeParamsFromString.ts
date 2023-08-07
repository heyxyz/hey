const removeParamsFromString = (inputString: string): string => {
  const indexOfQuestionMark = inputString.indexOf('?');
  if (indexOfQuestionMark !== -1) {
    return inputString.slice(0, indexOfQuestionMark);
  }
  return inputString;
};

export default removeParamsFromString;
