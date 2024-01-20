import type { FC } from 'react';

import Source from '@components/Publication/Source';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { type Profile } from '@hey/lens';
import formatRelativeOrAbsolute from '@hey/lib/datetime/formatRelativeOrAbsolute';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import isVerified from '@lib/isVerified';
import Link from 'next/link';
import { memo } from 'react';

import Slug from '../Shared/Slug';
import UserPreview from '../Shared/UserPreview';

interface FeedUserProfileProps {
  profile: Profile;
  source?: string;
  timestamp: Date;
}

const PublicationProfile: FC<FeedUserProfileProps> = ({
  profile,
  source,
  timestamp
}) => {
  return (
    <Link
      className="outline-brand-500 rounded-xl outline-offset-4"
      href={getProfile(profile).link}
    >
      <UserPreview
        handle={profile.handle?.fullHandle}
        id={profile.id}
        showUserPreview
      >
        <div className="flex max-w-sm items-center">
          <div className="truncate font-semibold">
            {getProfile(profile).displayName}
          </div>
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
              <span className="text-xs">
                {formatRelativeOrAbsolute(timestamp)}
              </span>
            </span>
          ) : null}
          {source ? (
            <span className="ld-text-gray-500 flex items-center">
              <span className="mx-1.5">·</span>
              <Source publishedOn={source} />
            </span>
          ) : null}
        </div>
      </UserPreview>
    </Link>
  );
};

export default memo(PublicationProfile);
