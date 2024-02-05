const getPublicationContentUrls = (inputString: string): string[] => {
  // Regular expression to match URLs
  const urlRegex = /https?:\/\/\S+(?<![!,.;?])/g;
  const matches = inputString.match(urlRegex);

  if (!matches) {
    return [];
  }

  // Remove duplicates
  return Array.from(new Set(matches));
};

export default getPublicationContentUrls;
