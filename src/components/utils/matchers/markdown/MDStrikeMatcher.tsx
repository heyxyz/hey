import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';

export class MDStrikeMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return <s>{children}</s>;
  }

  asTag(): string {
    return 's';
  }

  match(value: string) {
    return this.doMatch(value, /~~(.*?)~~/u, (matches) => ({
      match: matches[1]
    }));
  }
}
