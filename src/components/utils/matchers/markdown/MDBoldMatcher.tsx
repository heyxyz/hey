import { ChildrenNode, Matcher } from 'interweave'
import React from 'react'

export class MDBoldMatcher extends Matcher {
  replaceWith(children: ChildrenNode, props: object) {
    return <b {...props}>{children}</b>
  }

  asTag(): string {
    return 'b'
  }

  match(value: string) {
    return this.doMatch(value, /\*\*([^*]+)\*\*/u, (matches) => ({
      match: matches[1]
    }))
  }
}
