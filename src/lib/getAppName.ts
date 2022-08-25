const getAppName = (str: string): string => {
  const initCase = str.charAt(0).toUpperCase() + str.slice(1);
  const removeHyphen = initCase.replace(/-/g, ' ');

  return removeHyphen;
};

export default getAppName;
