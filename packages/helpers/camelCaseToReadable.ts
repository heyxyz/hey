const camelCaseToReadable = (text: string): string => {
  const result = text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

  return result;
};

export default camelCaseToReadable;
