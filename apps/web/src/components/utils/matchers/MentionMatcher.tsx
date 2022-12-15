import Slug from '@components/Shared/Slug';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import { Matcher } from 'interweave';
import Link from 'next/link';
import { createElement } from 'react';
import { PUBLICATION } from 'src/tracking';

export const Mention = ({ ...props }: any) => {
  return (
    <Link
      href={`/u/${formatHandle(props.display.slice(1))}`}
      onClick={(event) => {
        event.stopPropagation();
        Analytics.track(PUBLICATION.MENTION_CLICK);
      }}
    >
      <Slug slug={formatHandle(props.display)} />
    </Link>
  );
};

export class MentionMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Mention, props, match);
  }

  asTag(): string {
    return 'a';
  }

  match(value: string) {
    return this.doMatch(value, /@[\w.-]+/, (matches) => {
      return { display: matches[0] };
    });
  }
}
