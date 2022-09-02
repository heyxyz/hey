const getTags = (inputText: string) => {
  var regex = /(?:^|\s)#([\dA-Za-z]+)/gm;
  var matches = [];
  var match;

  while ((match = regex.exec(inputText))) {
    matches.push(match[1]);
  }

  return matches;
};

export default getTags;
