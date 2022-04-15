import * as linkify from 'linkifyjs'

const getURLFromPublication = (text: string): string => {
  return linkify.find(text).find((o) => o.type === 'url')?.href ?? ''
}

export default getURLFromPublication
