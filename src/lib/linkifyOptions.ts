export const linkifyOptions = {
  format: function (value: string, type: 'url') {
    if (type === 'url' && value.length > 36) {
      value = value.slice(0, 36) + '…'
    }
    return value
  },

  formatHref: function (href: string, type: 'mention'): string {
    if (type === 'mention') {
      href = '/u/' + href.slice(1)
    }
    return href
  },
  target: '_blank',
  rel: 'noreferrer'
}
