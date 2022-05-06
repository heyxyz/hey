import { ChildrenNode, Matcher } from 'interweave'
import React from 'react'

export class MDItalicMatcher extends Matcher {
  replaceWith(children: ChildrenNode, props: object) {
    return <i {...props}>{children}</i>
  }

  asTag(): string {
    return 'i'
  }

  match(value: string) {
    return this.doMatch(value, /_([^_]+)_/u, (matches) => ({
      match: matches[1]
    }))
  }
}
