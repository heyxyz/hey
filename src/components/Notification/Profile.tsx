import Avatar from '@components/UI/Avatar';
import { Profile } from '@generated/types';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import isVerified from '@lib/isVerified';
import Link from 'next/link';
import React, { FC } from 'react';

interface Props {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<Props> = ({ profile }) => {
  return (
    <Link href={`/u/${profile?.handle}`}>
      <a href={`/u/${profile?.handle}`}>
        <Avatar profile={profile} className="w-8 h-8 rounded-full" height={32} width={32} />
      </a>
    </Link>
  );
};

export const NotificationProfileName: FC<Props> = ({ profile }) => {
  return (
    <Link href={`/u/${profile?.handle}`}>
      <a href={`/u/${profile?.handle}`} className="inline-flex items-center space-x-1 font-bold">
        <div>{profile?.name ?? profile?.handle}</div>
        {isVerified(profile?.id) && <BadgeCheckIcon className="w-4 h-4 text-brand" />}
      </a>
    </Link>
  );
};
