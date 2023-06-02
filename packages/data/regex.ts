const RESTRICTED_SYMBOLS = '☑️✓✔✅';

const Regex = {
  url: /(http|https):\/\/([\w+.?])+([\w!#$%&'()*+,./:;=?@\\^~\-]*)?/g,
  mention: /(@[a-z\d-_.]{1,31})/g,
  hashtag: /(#\w*[A-Za-z]\w*)/g,
  ethereumAddress: /^(0x)?[\da-f]{40}$/i,
  handle: /^[\da-z]+$/g,
  allHandles: /([\s+])@(\S+)/g,
  santiizeHandle: /[^\d .A-Za-z]/g,
  profileNameValidator: new RegExp('^[^' + RESTRICTED_SYMBOLS + ']+$'),
  profileNameFilter: new RegExp('[' + RESTRICTED_SYMBOLS + ']', 'gu'),
  gm: /\bgm\b/i
};

export default Regex;
