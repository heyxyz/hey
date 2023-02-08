import { Analytics } from '@lib/analytics';
import { STATIC_IMAGES_URL } from 'data/constants';
import { hashflags } from 'data/hashflags';
import { Matcher } from 'interweave';
import Link from 'next/link';
import { createElement } from 'react';
import { PUBLICATION } from 'src/tracking';

export const Hashtag = ({ ...props }) => {
  const hashflag = props.display.slice(1).toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(hashflag);

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link
          href={`/search?q=${props.display.slice(1)}&type=pubs&src=link_click`}
          onClick={(event) => {
            event.stopPropagation();
            Analytics.track(PUBLICATION.HASHTAG_CLICK);
          }}
        >
          {props.display}
        </Link>
      </span>
      {hasHashflag && (
        <img
          className="!mr-0.5 h-4 w-4"
          height={16}
          width={16}
          src={`${STATIC_IMAGES_URL}/hashflags/${hashflags[hashflag]}.png`}
          alt={hashflag}
        />
      )}
    </span>
  );
};

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Hashtag, props, match);
  }

  asTag(): string {
    return 'a';
  }

  match(value: string) {
    return this.doMatch(value, /\B(#\w*[A-Za-z]+\w*\b)(?!;)/, (matches) => {
      return {
        display: matches[0]
      };
    });
  }
}
