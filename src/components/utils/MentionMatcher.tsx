import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

export function Mention({ handle, ...props }: any) {
  return (
    <Link href={`/u/${props.display.replace('@', '')}`}>{props.display}</Link>
  )
}

export class MentionMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(Mention, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /\B@(\w+)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
