import type { Profile } from '@hey/lens';
import Link from 'next/link';
import { type FC, memo } from 'react';

import { NotificationProfileName } from './Profile';

interface AggregatedNotificationTitleProps {
  firstProfile: Profile;
  text: string;
  type?: string;
  linkToType: string;
}

const AggregatedNotificationTitle: FC<AggregatedNotificationTitleProps> = ({
  firstProfile,
  text,
  type,
  linkToType
}) => {
  return (
    <div className="font bold">
      <NotificationProfileName profile={firstProfile} />
      <span> {text} </span>
      <span>
        {type ? (
          <Link href={linkToType} className="hover:underline">
            {type.toLowerCase()}
          </Link>
        ) : null}
      </span>
    </div>
  );
};

export default memo(AggregatedNotificationTitle);
