import Slug from '@components/Shared/Slug';
import UserPreview from '@components/Shared/UserPreview';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import { Matcher } from 'interweave';
import type { Profile } from 'lens';
import Link from 'next/link';
import { createElement } from 'react';
import { PUBLICATION } from 'src/tracking';

import { UrlMatcher } from './UrlMatcher';

export const Mention = ({ ...props }) => {
  const profile = {
    __typename: 'Profile',
    handle: props?.display.slice(1),
    name: null,
    id: null
  };

  return (
    <Link
      href={`/u/${formatHandle(props.display.slice(1))}`}
      onClick={(event) => {
        event.stopPropagation();
        Analytics.track(PUBLICATION.MENTION_CLICK);
      }}
    >
      {profile?.handle ? (
        <UserPreview
          isBig={props?.isBig}
          profile={profile as Profile}
          followStatusLoading={props?.followStatusLoading}
        >
          <Slug slug={formatHandle(props.display)} />
        </UserPreview>
      ) : (
        <Slug slug={formatHandle(props.display)} />
      )}
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
    const urlMatcher = new UrlMatcher('url');
    const urlResponse = urlMatcher.match(value);
    if (urlResponse) {
      const { host } = urlResponse;
      const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();
      const ALLOWED_MENTIONS = ['lens', 'test'];
      if (!ALLOWED_MENTIONS.includes(tld)) {
        return null;
      }
    }

    return this.doMatch(value, /@[\w.-]+/, (matches) => {
      return { display: matches[0] };
    });
  }
}
