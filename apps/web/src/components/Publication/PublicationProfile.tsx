import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import Source from '@components/Publication/Source';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { apps } from '@hey/data/apps';
import formatRelativeOrAbsolute from '@hey/lib/datetime/formatRelativeOrAbsolute';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import Link from 'next/link';
import { memo } from 'react';
import isVerified from 'src/helpers/isVerified';

import Slug from '../Shared/Slug';
import UserPreview from '../Shared/UserPreview';

interface FeedUserProfileProps {
  profile: Profile;
  publicationId: string;
  source?: string;
  timestamp: Date;
}

const PublicationProfile: FC<FeedUserProfileProps> = ({
  profile,
  publicationId,
  source,
  timestamp
}) => {
  const WrappedLink = ({ children }: { children: ReactNode }) => (
    <Link
      className="truncate outline-none hover:underline focus:underline"
      href={getProfile(profile).link}
    >
      <UserPreview
        handle={profile.handle?.fullHandle}
        id={profile.id}
        showUserPreview
      >
        {children}
      </UserPreview>
    </Link>
  );

  return (
    <div className="flex max-w-sm flex-wrap items-center">
      <WrappedLink>
        <span className="font-semibold">{getProfile(profile).displayName}</span>
      </WrappedLink>
      <WrappedLink>
        <Slug
          className="ml-1 truncate text-sm"
          slug={getProfile(profile).slugWithPrefix}
        />
      </WrappedLink>
      {isVerified(profile.id) ? (
        <CheckBadgeIcon className="text-brand-500 ml-1 size-4" />
      ) : null}
      {hasMisused(profile.id) ? (
        <ExclamationCircleIcon className="ml-1 size-4" />
      ) : null}
      {timestamp ? (
        <span className="ld-text-gray-500 truncate">
          <span className="mx-1">·</span>
          <Link
            className="text-xs hover:underline"
            href={`/posts/${publicationId}`}
          >
            {formatRelativeOrAbsolute(timestamp)}
          </Link>
        </span>
      ) : null}
      {source && apps.includes(source) ? (
        <span className="ld-text-gray-500 flex items-center">
          <span className="mx-1">·</span>
          <Source publishedOn={source} />
        </span>
      ) : null}
    </div>
  );
};

export default memo(PublicationProfile);
