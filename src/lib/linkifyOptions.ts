import Router from 'next/router'

import trackEvent from './trackEvent'

const linkifyOptions = {
  format: (value: string, type: string): string => {
    if (type === 'url' && value.length > 36) {
      value = value.slice(0, 36) + '…'
    }
    return value
  },
  formatHref: (href: string, type: string) => {
    if (type === 'url') {
      return href
    }
  },
  target: (href: string, type: string): string => {
    if (type === 'url') {
      return '_blank'
    }
    return '_self'
  },
  attributes: (href: string, type: string) => {
    return {
      title: href,
      class: 'cursor-pointer',
      onClick: () => {
        if (type === 'mention') {
          trackEvent('mention', 'click')
          Router.push(`/u/${href.slice(1)}`)
        }
        if (type === 'hashtag') {
          trackEvent('hashtag', 'click')
          Router.push(`/search?q=${href.slice(1)}&type=pubs&src=link_click`)
        }
      }
    }
  }
}

export default linkifyOptions
