import { PUBLICATION } from '@hey/data/tracking';
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
      {handle ? (
        <UserPreview isBig={false} handle={handle} followStatusLoading={false}>
          <Slug slug={formatHandle(handle)} prefix="@" useBrandColor />
        </UserPreview>
      ) : (
        <Slug slug={formatHandle(handle)} prefix="@" useBrandColor />
      )}
    </Link>
  );
};

export default Mention;
