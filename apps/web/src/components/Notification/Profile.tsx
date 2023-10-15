import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import type { Profile } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import getAvatar from '@hey/lib/getAvatar';
import hasMisused from '@hey/lib/hasMisused';
import sanitizeDisplayName from '@hey/lib/sanitizeDisplayName';
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
    <Link href={`/u/${formatHandle(profile?.handle)}`}>
      <Image
        src={getAvatar(profile)}
        className="h-8 w-8 rounded-full border bg-gray-200 dark:border-gray-700"
        height={32}
        width={32}
        alt={profile.id}
      />
    </Link>
  );
};

export const NotificationProfileName: FC<NotificationProfileProps> = ({
  profile
}) => {
  return (
    <Link
      href={`/u/${formatHandle(profile?.handle)}`}
      className="inline-flex items-center space-x-1 font-bold hover:underline"
    >
      <span>
        {sanitizeDisplayName(profile?.metadata?.displayName) ??
          formatHandle(profile?.handle)}
      </span>
      {isVerified(profile.id) ? (
        <CheckBadgeIcon className="text-brand h-4 w-4" />
      ) : null}
      {hasMisused(profile.id) ? (
        <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
      ) : null}
    </Link>
  );
};

interface AggregatedNotificationTitleProps {
  firstProfile: Profile;
  text: string;
  type?: string;
}

export const AggregatedNotificationTitle: FC<
  AggregatedNotificationTitleProps
> = ({ firstProfile, text, type }) => {
  return (
    <div className="font bold">
      <NotificationProfileName profile={firstProfile} />
      <span> {text} </span>
      <span>{type ? type.toLowerCase() : null}</span>
    </div>
  );
};
