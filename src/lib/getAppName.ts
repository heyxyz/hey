const getAppName = (str: string): string => {
  const initCase = str.charAt(0).toUpperCase() + str.slice(1);
  return initCase.replace(/-/g, ' ');
};

export default getAppName;
