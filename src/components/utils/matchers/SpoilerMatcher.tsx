import { ChildrenNode, Matcher } from 'interweave'
import React from 'react'

export class SpoilerMatcher extends Matcher {
  replaceWith(children: ChildrenNode, props: object) {
    let count = 1

    return (
      <span className="mx-0.5 text-black text-opacity-0 bg-gray-900 rounded-lg cursor-pointer active:text-opacity-100 active:bg-gray-200 px-[5px] py-[2px]">
        {children}
      </span>
    )
  }

  asTag(): string {
    return 'span'
  }

  match(value: string) {
    return this.doMatch(value, /\|\|([^*]+)\|\|/u, (matches) => ({
      match: matches[1]
    }))
  }
}
