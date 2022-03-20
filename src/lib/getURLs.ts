export const getURLs = (text: string) => {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
  return text.match(urlRegex) ?? []
}
