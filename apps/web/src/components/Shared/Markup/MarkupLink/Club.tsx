import type { MarkupLinkProps } from '@hey/types/misc';
import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { CLUB_HANDLE_PREFIX } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import Link from 'next/link';

const Club: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  const club = title.slice(1).replace(CLUB_HANDLE_PREFIX, '').toLowerCase();
  const clubHandle = `/${club}`;
  const clubUrl = `https://orb.ac/c/${club}`;

  return (
    <span>
      <Link
        className="cursor-pointer outline-none focus:underline"
        href={clubUrl}
        onClick={(event) => {
          stopEventPropagation(event);
          Leafwatch.track(PUBLICATION.CLICK_CLUB, { club: clubHandle });
        }}
        target="_blank"
      >
        {clubHandle}
      </Link>
    </span>
  );
};

export default Club;
