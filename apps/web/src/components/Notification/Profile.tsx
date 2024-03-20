import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import UserPreview from '@components/Shared/UserPreview';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import getAvatar from '@hey/lib/getAvatar';
import getLennyURL from '@hey/lib/getLennyURL';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Image } from '@hey/ui';
import isVerified from '@lib/isVerified';
import Link from 'next/link';

interface NotificationProfileProps {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<NotificationProfileProps> = ({
  profile
}) => {
  return (
    <UserPreview handle={profile.handle?.fullHandle} id={profile.id}>
      <Link
        className="rounded-full outline-offset-2"
        href={getProfile(profile).link}
        onClick={stopEventPropagation}
      >
        <Image
          alt={profile.id}
          className="size-7 rounded-full border bg-gray-200 sm:size-8 dark:border-gray-700"
          height={32}
          onError={({ currentTarget }) => {
            currentTarget.src = getLennyURL(profile.id);
          }}
          src={getAvatar(profile)}
          width={32}
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
        className="inline-flex items-center space-x-1 font-bold outline-none hover:underline focus:underline"
        href={getProfile(profile).link}
        onClick={stopEventPropagation}
      >
        <span>{getProfile(profile).displayName}</span>
        {isVerified(profile.id) ? (
          <CheckBadgeIcon className="text-brand-500 size-4" />
        ) : null}
        {hasMisused(profile.id) ? (
          <ExclamationCircleIcon className="size-4" />
        ) : null}
      </Link>
    </UserPreview>
  );
};
