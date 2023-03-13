import { Image } from '@components/UI/Image';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import type { Profile } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface NotificationProfileProps {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<NotificationProfileProps> = ({ profile }) => {
  return (
    <Link href={`/u/${formatHandle(profile?.handle)}`}>
      <Image
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

export const NotificationProfileName: FC<NotificationProfileProps> = ({ profile }) => {
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
