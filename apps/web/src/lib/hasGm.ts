const hasGm = (inputText: string) => {
  const regex = /\bgm\b/gi;

  return regex.test(inputText);
};

export default hasGm;
