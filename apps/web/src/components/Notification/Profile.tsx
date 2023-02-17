import { BadgeCheckIcon } from '@heroicons/react/solid';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import type { Profile } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<Props> = ({ profile }) => {
  return (
    <Link href={`/u/${formatHandle(profile?.handle)}`}>
      <img
        onError={({ currentTarget }) => {
          currentTarget.src = getAvatar(profile, false);
        }}
        src={getAvatar(profile)}
        className="h-8 w-8 rounded-full border bg-gray-200 dark:border-gray-700"
        height={32}
        width={32}
        alt={formatHandle(profile?.handle)}
      />
    </Link>
  );
};

export const NotificationProfileName: FC<Props> = ({ profile }) => {
  return (
    <Link
      href={`/u/${formatHandle(profile?.handle)}`}
      className="inline-flex items-center space-x-1 font-bold"
    >
      <div>{profile?.name ?? formatHandle(profile?.handle)}</div>
      {isVerified(profile?.id) && <BadgeCheckIcon className="text-brand h-4 w-4" />}
    </Link>
  );
};
