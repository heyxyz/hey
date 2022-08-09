const getURLs = (text: string) => {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.match(urlRegex) ?? [];
};

export default getURLs;
