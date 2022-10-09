import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';

export class MDBoldMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return <b>{children}</b>;
  }

  asTag(): string {
    return 'b';
  }

  match(value: string) {
    return this.doMatch(value, /\*\*(.*?)\*\*/u, (matches) => ({
      match: matches[1]
    }));
  }
}
