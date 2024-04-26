import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import formatRelativeOrAbsolute from '@hey/lib/datetime/formatRelativeOrAbsolute';
import getAvatar from '@hey/lib/getAvatar';
import getLennyURL from '@hey/lib/getLennyURL';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { memo } from 'react';
import isVerified from 'src/helpers/isVerified';

import Slug from './Slug';

interface UserProfileProps {
  hideSlug?: boolean;
  linkToProfile?: boolean;
  profile: Profile;
  smallAvatar?: boolean;
  timestamp?: Date;
}

const SmallUserProfile: FC<UserProfileProps> = ({
  hideSlug = false,
  linkToProfile = false,
  profile,
  smallAvatar = false,
  timestamp = ''
}) => {
  const UserAvatar = () => (
    <Image
      alt={profile.id}
      className={cn(
        smallAvatar ? 'size-4' : 'size-6',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={smallAvatar ? 16 : 24}
      loading="lazy"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(profile.id);
      }}
      src={getAvatar(profile)}
      width={smallAvatar ? 16 : 24}
    />
  );

  const UserName = () => (
    <div className="flex max-w-full flex-wrap items-center">
      <div className={cn(!hideSlug && 'max-w-[75%]', 'mr-1 truncate')}>
        {getProfile(profile).displayName}
      </div>
      {isVerified(profile.id) ? (
        <CheckBadgeIcon className="text-brand-500 mr-1 size-4" />
      ) : null}
      {hasMisused(profile.id) ? (
        <ExclamationCircleIcon className="mr-2 size-4 text-red-500" />
      ) : null}
      {!hideSlug ? (
        <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
      ) : null}
      {timestamp ? (
        <span className="ld-text-gray-500">
          <span className="mx-1.5">·</span>
          <span className="text-xs">{formatRelativeOrAbsolute(timestamp)}</span>
        </span>
      ) : null}
    </div>
  );

  return linkToProfile ? (
    <Link href={getProfile(profile).link}>
      <div className="flex items-center space-x-2">
        <UserAvatar />
        <UserName />
      </div>
    </Link>
  ) : (
    <div className="flex items-center space-x-2">
      <UserAvatar />
      <UserName />
    </div>
  );
};

export default memo(SmallUserProfile);
