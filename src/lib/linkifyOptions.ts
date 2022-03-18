export const linkifyOptions = {
  formatHref: function (href: string, type: 'mention'): string {
    if (type === 'mention') {
      href = '/u/' + href.slice(1)
    }
    return href
  },
  target: '_blank',
  rel: 'noreferrer'
}
