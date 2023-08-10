const RESTRICTED_SYMBOLS = '☑️✓✔✅';

export const Regex = {
  url: /[\w#%+.:=@~-]{1,256}\.[\d()a-z]{1,6}\b([\w#%&()+./:=?@~-]*)?/gi,
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
