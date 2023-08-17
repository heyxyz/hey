import { BadgeCheckIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import hasMisused from '@lenster/lib/hasMisused';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import { Image } from '@lenster/ui';
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
        alt={formatHandle(profile?.handle)}
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
      className="inline-flex items-center space-x-1 font-bold"
    >
      <div>
        {sanitizeDisplayName(profile?.name) ?? formatHandle(profile?.handle)}
      </div>
      {isVerified(profile.id) && (
        <BadgeCheckIcon className="text-brand h-4 w-4" />
      )}
      {hasMisused(profile.id) && (
        <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
      )}
    </Link>
  );
};
