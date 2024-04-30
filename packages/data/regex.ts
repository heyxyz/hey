const RESTRICTED_SYMBOLS = '☑️✓✔✅';

export const Regex = {
  cashtag: /(\$\w*[A-Za-z]\w*)/g,
  ethereumAddress: /^(0x)?[\da-f]{40}$/i,
  handle: /^[\dA-Za-z]\w{4,25}$/g,
  hashtag: /(#\w*[A-Za-z]\w*)/g,
  mention: /@\w+\/([\dA-Za-z]\w{2,25})/g,
  profileNameFilter: new RegExp(`[${RESTRICTED_SYMBOLS}]`, 'gu'),
  profileNameValidator: new RegExp(`^[^${RESTRICTED_SYMBOLS}]+$`),
  txHash: /^0x[\dA-Fa-f]{64}$/,
  // modified version of https://stackoverflow.com/a/6041965/961254 to support unicode international characters
  url: /\b(http|https):\/\/([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+))([\p{L}\p{N}_.,@?^=%&:\/~+#-]*[\p{L}\p{N}_@?^=%&\/~+#-])/gu
};
