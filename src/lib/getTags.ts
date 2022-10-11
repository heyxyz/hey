const getTags = (inputText: string) => {
  const regex = /(?:^|\s)#([\dA-Za-z]+)/gm;
  const matches: any = [];
  let match;

  while ((match = regex.exec(inputText))) {
    matches.push(match[1]);
  }

  // @ts-ignore
  return matches.filter((item, pos) => matches.indexOf(item) == pos).slice(0, 5);
};

export default getTags;
