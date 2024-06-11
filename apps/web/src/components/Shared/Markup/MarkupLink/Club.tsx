import type { MarkupLinkProps } from '@hey/types/misc';
import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { CLUB_HANDLE_PREFIX } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import toast from 'react-hot-toast';

const Club: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  const club = title.slice(1).replace(CLUB_HANDLE_PREFIX, '').toLowerCase();
  const clubHandle = `/${club}`;

  return (
    <a
      className="cursor-pointer outline-none focus:underline"
      onClick={(event) => {
        toast.success('Clubs coming soon to Hey!');
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.CLICK_CLUB, { club: clubHandle });
      }}
    >
      {clubHandle}
    </a>
  );
};

export default Club;
