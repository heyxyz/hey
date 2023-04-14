import tlds from 'tlds';

const protocol = "(?:(?:[a-z]+:)?//)?";
const auth = '(?:\\S+(?::\\S*)?@)?';
const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
const tld = `(?:\\.(?:${tlds.sort((a, b) => b.length - a.length).join('|')}))+`;
const port = '(?::\\d{2,5})?';
const path = '(?:[/?#][^\\s"]*)?';
const regex = `(?:${protocol}|www\\.)${auth}(?:${host}${domain}${tld})${port}${path}`;

export const urlRegex = new RegExp(`(${regex})(?=[^#@\\w]|$)`, 'ig');
export const mentionRegex = /(@[a-z\d-_.]{1,31})/g;
export const hashtagRegex = /(#\w*[A-Za-z]\w*)/g;
