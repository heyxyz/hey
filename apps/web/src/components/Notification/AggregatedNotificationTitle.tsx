import type { Profile } from '@hey/lens';
import { Link } from 'react-router-dom';
import { type FC } from 'react';

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
          <Link to={linkToType} className="hover:underline">
            {type.toLowerCase()}
          </Link>
        ) : null}
      </span>
    </div>
  );
};

export default AggregatedNotificationTitle;
