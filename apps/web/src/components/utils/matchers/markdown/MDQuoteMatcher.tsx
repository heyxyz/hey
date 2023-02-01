import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';

export class MDQuoteMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return (
      <span className="border-l-4 py-1.5 pl-2 text-gray-700 dark:border-gray-700 dark:text-gray-400">
        {children}
      </span>
    );
  }

  asTag(): string {
    return 'span';
  }

  match(value: string) {
    return this.doMatch(value, /^> (.*$)/, (matches) => ({
      match: matches[1]
    }));
  }
}
