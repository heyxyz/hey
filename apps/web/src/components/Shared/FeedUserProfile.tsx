import type { FC } from 'react';

import Source from '@components/Publication/Source';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { type Profile } from '@hey/lens';
import formatRelativeOrAbsolute from '@hey/lib/datetime/formatRelativeOrAbsolute';
import getAvatar from '@hey/lib/getAvatar';
import getLennyURL from '@hey/lib/getLennyURL';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import isVerified from '@lib/isVerified';
import Link from 'next/link';
import { memo } from 'react';

import Slug from './Slug';
import UserPreview from './UserPreview';

interface FeedUserProfileProps {
  profile: Profile;
  quoted?: boolean;
  source?: string;
  timestamp: Date;
}

const FeedUserProfile: FC<FeedUserProfileProps> = ({
  profile,
  quoted = false,
  source,
  timestamp
}) => {
  const UserAvatar = () => (
    <Image
      alt={profile.id}
      className={cn(
        quoted ? 'size-6' : 'size-12',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={quoted ? 25 : 48}
      loading="lazy"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(profile.id);
      }}
      src={getAvatar(profile)}
      width={quoted ? 25 : 48}
    />
  );

  const UserName = () => (
    <div className="flex max-w-sm items-center">
      <b className="truncate">{getProfile(profile).displayName}</b>
      <Slug
        className="ml-1.5 truncate text-sm"
        slug={getProfile(profile).slugWithPrefix}
      />
      {isVerified(profile.id) ? (
        <CheckBadgeIcon className="text-brand-500 ml-1 size-4" />
      ) : null}
      {hasMisused(profile.id) ? (
        <ExclamationCircleIcon className="ml-1 size-4 text-red-500" />
      ) : null}
      {timestamp ? (
        <span className="ld-text-gray-500 truncate">
          <span className="mx-1.5">·</span>
          <span className="text-xs">{formatRelativeOrAbsolute(timestamp)}</span>
        </span>
      ) : null}
      {source ? (
        <span className="ld-text-gray-500 flex items-center">
          <span className="mx-1.5">·</span>
          <Source publishedOn={source} />
        </span>
      ) : null}
    </div>
  );

  const UserInfo: FC = () => {
    return (
      <UserPreview
        handle={profile.handle?.fullHandle}
        id={profile.id}
        showUserPreview
      >
        <div
          className={cn(
            quoted ? 'items-center' : 'items-start',
            'mr-8 flex space-x-3'
          )}
        >
          <UserAvatar />
          <UserName />
        </div>
      </UserPreview>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <Link
        className="outline-brand-500 rounded-xl outline-offset-4"
        href={getProfile(profile).link}
      >
        <UserInfo />
      </Link>
    </div>
  );
};

export default memo(FeedUserProfile);
