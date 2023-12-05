import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import Link from 'next/link';

import { NotificationProfileName } from './Profile';

interface AggregatedNotificationTitleProps {
  firstProfile: Profile;
  linkToType: string;
  text: string;
  type?: string;
}

const AggregatedNotificationTitle: FC<AggregatedNotificationTitleProps> = ({
  firstProfile,
  linkToType,
  text,
  type
}) => {
  return (
    <div className="font bold">
      <NotificationProfileName profile={firstProfile} />
      <span> {text} </span>
      <span>
        {type ? (
          <Link className="hover:underline" href={linkToType}>
            {type.toLowerCase()}
          </Link>
        ) : null}
      </span>
    </div>
  );
};

export default AggregatedNotificationTitle;
