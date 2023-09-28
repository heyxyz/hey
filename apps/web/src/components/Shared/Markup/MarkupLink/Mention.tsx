import { PUBLICATION } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { MarkupLinkProps } from '@hey/types/misc';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

import Slug from '../../Slug';
import UserPreview from '../../UserPreview';

const Mention: FC<MarkupLinkProps> = ({ href, title = href }) => {
  const handle = title?.slice(1);

  if (!handle) {
    return null;
  }

  const profile = {
    __typename: 'Profile',
    handle: handle,
    name: null,
    id: null
  };

  return (
    <Link
      href={`/u/${formatHandle(handle)}`}
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.CLICK_MENTION, {
          handle: formatHandle(handle)
        });
      }}
    >
      {profile?.handle ? (
        <UserPreview
          isBig={false}
          profile={profile as Profile}
          followStatusLoading={false}
        >
          <Slug slug={formatHandle(handle)} prefix="@" />
        </UserPreview>
      ) : (
        <Slug slug={formatHandle(handle)} prefix="@" />
      )}
    </Link>
  );
};

export default Mention;
