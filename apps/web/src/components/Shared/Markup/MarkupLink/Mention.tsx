import { PUBLICATION } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { MarkupLinkProps } from '@lenster/types/misc';
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
    id: null,
    handle: handle,
    metadata: {
      displayName: null
    },
    __typename: 'Profile'
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
