import { ChildrenNode, Matcher } from 'interweave'
import React from 'react'

export class MDCodeMatcher extends Matcher {
  replaceWith(children: ChildrenNode, props: object) {
    return (
      <code
        className="bg-gray-300 text-sm px-[5px] py-[2px] rounded-lg"
        {...props}
      >
        {children}
      </code>
    )
  }

  asTag(): string {
    return 'code'
  }

  match(value: string) {
    return this.doMatch(value, /`([^_]+)`/u, (matches) => ({
      match: matches[1]
    }))
  }
}
