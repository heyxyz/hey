const getTags = (inputText: string) => {
  var regex = /(?:^|\s)#([\dA-Za-z]+)/gm;
  var matches: any = [];
  var match;

  while ((match = regex.exec(inputText))) {
    matches.push(match[1]);
  }

  // @ts-ignore
  return matches.filter((item, pos) => matches.indexOf(item) == pos).slice(0, 5);
};

export default getTags;
