const convertToTitleCase = (input: string): string => {
  const words = input.toLowerCase().split("_");
  const titleCasedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return titleCasedWords.join(" ");
};

export default convertToTitleCase;
