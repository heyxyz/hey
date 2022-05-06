import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

export function Hashtag({ handle, ...props }: any) {
  return (
    <Link
      href={`/search?q=${props.display.replace(
        '#',
        ''
      )}&type=pubs&src=link_click`}
    >
      {props.display}
    </Link>
  )
}

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(Hashtag, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /\B#(\w+)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
