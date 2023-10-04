const RESTRICTED_SYMBOLS = '☑️✓✔✅';

export const Regex = {
  // modified version of https://stackoverflow.com/a/6041965/961254 to support unicode international characters
  url: /\b(http|https):\/\/([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+))([\p{L}\p{N}_.,@?^=%&:\/~+#-]*[\p{L}\p{N}_@?^=%&\/~+#-])/gu,
  mention: /@[\w.\-]{1,30}[\w-]/g,
  hashtag: /(#\w*[A-Za-z]\w*)/g,
  ethereumAddress: /^(0x)?[\da-f]{40}$/i,
  handle: /^[\da-z]+$/g,
  santiizeHandle: /[^\d .A-Za-z]/g,
  profileNameValidator: new RegExp('^[^' + RESTRICTED_SYMBOLS + ']+$'),
  profileNameFilter: new RegExp('[' + RESTRICTED_SYMBOLS + ']', 'gu'),
  gm: /\bgm\b/i
};
