import UserPreview from '@components/Shared/UserPreview';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import type { Profile } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import { Image } from '@hey/ui';
import isVerified from '@lib/isVerified';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface NotificationProfileProps {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<NotificationProfileProps> = ({
  profile
}) => {
  return (
    <UserPreview handle={profile.handle?.fullHandle} id={profile.id}>
      <Link to={getProfile(profile).link}>
        <Image
          src={getAvatar(profile)}
          className="h-7 w-7 rounded-full border bg-gray-200 dark:border-gray-700 sm:h-8 sm:w-8"
          height={32}
          width={32}
          alt={profile.id}
        />
      </Link>
    </UserPreview>
  );
};

export const NotificationProfileName: FC<NotificationProfileProps> = ({
  profile
}) => {
  return (
    <UserPreview handle={profile.handle?.fullHandle} id={profile.id}>
      <Link
        to={getProfile(profile).link}
        className="inline-flex items-center space-x-1 font-bold hover:underline"
      >
        <span>{getProfile(profile).displayName}</span>
        {isVerified(profile.id) ? (
          <CheckBadgeIcon className="text-brand-500 h-4 w-4" />
        ) : null}
        {hasMisused(profile.id) ? (
          <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
        ) : null}
      </Link>
    </UserPreview>
  );
};
