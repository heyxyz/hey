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
import Link from 'next/link';
import type { FC } from 'react';

interface NotificationProfileProps {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<NotificationProfileProps> = ({
  profile
}) => {
  return (
    <UserPreview handle={profile.handle?.fullHandle} id={profile.id}>
      <Link href={getProfile(profile).link}>
        <Image
          src={getAvatar(profile)}
          className="h-8 w-8 rounded-full border bg-gray-200 dark:border-gray-700"
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
        href={getProfile(profile).link}
        className="inline-flex items-center space-x-1 font-bold hover:underline"
      >
        <span>{getProfile(profile).displayName}</span>
        {isVerified(profile.id) ? (
          <CheckBadgeIcon className="text-brand h-4 w-4" />
        ) : null}
        {hasMisused(profile.id) ? (
          <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
        ) : null}
      </Link>
    </UserPreview>
  );
};
