import type { ChildrenNode } from 'interweave';
import { Matcher } from 'interweave';

export class MDCodeMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return (
      <code className="rounded-lg bg-gray-300 px-[5px] py-[2px] text-sm dark:bg-gray-700">{children}</code>
    );
  }

  asTag(): string {
    return 'code';
  }

  match(value: string) {
    return this.doMatch(
      value,
      /`(.*?)`/u,
      (matches) => ({
        match: matches[1]
      }),
      true
    );
  }
}
