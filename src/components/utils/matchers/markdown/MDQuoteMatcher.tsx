import { ChildrenNode, Matcher } from 'interweave'
import React from 'react'

export class MDQuoteMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return (
      <span className="border-l-4 pl-2 py-1.5 text-gray-700">{children}</span>
    )
  }

  asTag(): string {
    return 'span'
  }

  match(value: string) {
    return this.doMatch(value, /^\> (.*$)/, (matches) => ({
      match: matches[1]
    }))
  }
}
