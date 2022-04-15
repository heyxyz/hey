const linkifyOptions = {
  format: function (value: string, type: 'url'): string {
    if (type === 'url' && value.length > 36) {
      value = value.slice(0, 36) + '…'
    }
    return value
  },

  formatHref: function (href: string, type: 'mention' | 'hashtag'): string {
    if (type === 'hashtag') {
      href = `/search?q=${href.slice(1)}&type=pubs&src=link_click`
    }
    if (type === 'mention') {
      href = '/u/' + href.slice(1)
    }
    return href
  },

  target: function (href: string, type: 'url'): string {
    if (type === 'url') {
      return '_blank'
    }
    return '_self'
  }
}

export default linkifyOptions
