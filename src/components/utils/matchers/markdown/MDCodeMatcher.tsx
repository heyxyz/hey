import { ChildrenNode, Matcher } from 'interweave';
import React from 'react';

export class MDCodeMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return (
      <code className="text-sm bg-gray-300 rounded-lg dark:bg-gray-700 px-[5px] py-[2px]">{children}</code>
    );
  }

  asTag(): string {
    return 'code';
  }

  match(value: string) {
    return this.doMatch(value, /`(.*?)`/u, (matches) => ({
      match: matches[1]
    }));
  }
}
