import Slug from '@components/Shared/Slug';
import UserPreview from '@components/Shared/UserPreview';
import { Leafwatch } from '@lib/leafwatch';
import { Matcher } from 'interweave';
import type { Profile } from 'lens';
// import { useProfileQuery } from 'lens';
import Link from 'next/link';
import { createElement } from 'react';
import { PUBLICATION } from 'src/tracking';

export const Mention = ({ ...props }: any) => {
  // const { data } = useProfileQuery({
  //   variables: { request: { handle: props?.display.slice(1) } }
  // });
  // const profile = data?.profile;
  const profile = {
    __typename: 'Profile',
    handle: props?.display.slice(1),
    name: '',
    id: ''
  };

  return (
    <Link
      href={`/u/${props.display.slice(1)}`}
      onClick={(event) => {
        event.stopPropagation();
        Leafwatch.track(PUBLICATION.MENTION_CLICK, { username: props.display });
      }}
    >
      {profile?.handle ? (
        <UserPreview
          isBig={props?.isBig}
          profile={profile as Profile}
          followStatusLoading={props?.followStatusLoading}
        >
          <Slug slug={props.display} />
        </UserPreview>
      ) : (
        <Slug slug={props.display} />
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
    return this.doMatch(value, /@[\w.-]+/, (matches) => {
      return {
        display: matches[0]
      };
    });
  }
}
