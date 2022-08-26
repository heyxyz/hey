import Slug from '@components/Shared/Slug';
import { Matcher } from 'interweave';
import Link from 'next/link';
import React from 'react';

export function Mention({ ...props }: any) {
  return (
    <Link href={`/u/${props.display.slice(1)}`}>
      <Slug className="text-md" slug={props.display} />
    </Link>
  );
}

export class MentionMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(Mention, props, match);
  }

  asTag(): string {
    return 'a';
  }

  match(value: string) {
    return this.doMatch(value, /@[\w.]+/, (matches) => {
      return {
        display: matches[0]
      };
    });
  }
}
