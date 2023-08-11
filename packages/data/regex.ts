const RESTRICTED_SYMBOLS = '☑️✓✔✅';

export const Regex = {
  url: /(?:(http|https):\/\/)?(?:[\w-]+\.)+[a-z]{2,6}\b([\w#%&()+./:=?@~-]*)?/gi,
  mention: /@[\w.\-]{1,30}[\w-]/g,
  hashtag: /(#\w*[A-Za-z]\w*)/g,
  ethereumAddress: /^(0x)?[\da-f]{40}$/i,
  handle: /^[\da-z]+$/g,
  santiizeHandle: /[^\d .A-Za-z]/g,
  profileNameValidator: new RegExp('^[^' + RESTRICTED_SYMBOLS + ']+$'),
  profileNameFilter: new RegExp('[' + RESTRICTED_SYMBOLS + ']', 'gu'),
  gm: /\bgm\b/i,
  accessToken: /^([\w=]+)\.([\w=]+)\.([\w+/=\-]*)/
};
