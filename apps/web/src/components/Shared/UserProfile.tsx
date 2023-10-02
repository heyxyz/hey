import Unfollow from '@components/Shared/Profile/Unfollow';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import type { Profile } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import getAvatar from '@hey/lib/getAvatar';
import getProfileAttribute from '@hey/lib/getProfileAttribute';
import hasMisused from '@hey/lib/hasMisused';
import sanitizeDisplayName from '@hey/lib/sanitizeDisplayName';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import { formatTime, getTwitterFormat } from '@lib/formatTime';
import isVerified from '@lib/isVerified';
import Link from 'next/link';
import type { FC } from 'react';
import { memo, useState } from 'react';

import Markup from './Markup';
import Follow from './Profile/Follow';
import Slug from './Slug';
import SuperFollow from './SuperFollow';
import UserPreview from './UserPreview';

interface UserProfileProps {
  profile: Profile;
  followStatusLoading?: boolean;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
  showBio?: boolean;
  showFollow?: boolean;
  showUnfollow?: boolean;
  showStatus?: boolean;
  showUserPreview?: boolean;
  timestamp?: Date;

  // For data analytics
  followUnfollowPosition?: number;
  followUnfollowSource?: string;
}

const UserProfile: FC<UserProfileProps> = ({
  profile,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
  linkToProfile = true,
  showBio = false,
  showFollow = false,
  showUnfollow = false,
  showStatus = false,
  showUserPreview = true,
  timestamp = '',
  followUnfollowPosition,
  followUnfollowSource
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const statusEmoji = getProfileAttribute(profile?.attributes, 'statusEmoji');
  const statusMessage = getProfileAttribute(
    profile?.attributes,
    'statusMessage'
  );
  const hasStatus = statusEmoji && statusMessage;

  const UserAvatar = () => (
    <Image
      src={getAvatar(profile)}
      loading="lazy"
      className={cn(
        isBig ? 'h-14 w-14' : 'h-10 w-10',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={formatHandle(profile?.handle)}
    />
  );

  const UserName = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={cn(isBig ? 'font-bold' : 'text-md', 'grid')}>
          <div className="truncate">
            {sanitizeDisplayName(profile?.name) ??
              formatHandle(profile?.handle)}
          </div>
        </div>
        {isVerified(profile.id) ? (
          <CheckBadgeIcon className="text-brand ml-1 h-4 w-4" />
        ) : null}
        {hasMisused(profile.id) ? (
          <ExclamationCircleIcon className="ml-1 h-4 w-4 text-red-500" />
        ) : null}
        {showStatus && hasStatus ? (
          <div className="lt-text-gray-500 flex items-center">
            <span className="mx-1.5">·</span>
            <span className="flex max-w-[10rem] items-center space-x-1 text-xs">
              <span>{statusEmoji}</span>
              <span className="truncate">{statusMessage}</span>
            </span>
          </div>
        ) : null}
      </div>
      <div>
        <Slug
          className="text-sm"
          slug={formatHandle(profile?.handle)}
          prefix="@"
        />
        {timestamp ? (
          <span className="lt-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs" title={formatTime(timestamp as Date)}>
              {getTwitterFormat(timestamp)}
            </span>
          </span>
        ) : null}
      </div>
    </>
  );

  const UserInfo: FC = () => {
    return (
      <UserPreview
        isBig={isBig}
        profile={profile}
        followStatusLoading={followStatusLoading}
        showUserPreview={showUserPreview}
      >
        <div className="mr-8 flex items-center space-x-3">
          <UserAvatar />
          <div>
            <UserName />
            {showBio && profile?.bio ? (
              <div
                // Replace with Tailwind
                style={{ wordBreak: 'break-word' }}
                className={cn(
                  isBig ? 'text-base' : 'text-sm',
                  'mt-2',
                  'linkify leading-6'
                )}
              >
                <Markup>{profile?.bio}</Markup>
              </div>
            ) : null}
          </div>
        </div>
      </UserPreview>
    );
  };

  return (
    <div
      className="flex items-center justify-between"
      data-testid={`user-profile-${profile.id}`}
    >
      {linkToProfile ? (
        <Link href={`/u/${formatHandle(profile?.handle)}`}>
          <UserInfo />
        </Link>
      ) : (
        <UserInfo />
      )}
      {showFollow ? (
        followStatusLoading ? (
          <div className="shimmer h-8 w-10 rounded-lg" />
        ) : following ? null : profile?.followModule?.__typename ===
          'FeeFollowModuleSettings' ? (
          <SuperFollow
            profile={profile}
            setFollowing={setFollowing}
            followUnfollowPosition={followUnfollowPosition}
            followUnfollowSource={followUnfollowSource}
          />
        ) : (
          <Follow
            profile={profile}
            setFollowing={setFollowing}
            followUnfollowPosition={followUnfollowPosition}
            followUnfollowSource={followUnfollowSource}
          />
        )
      ) : null}
      {showUnfollow ? (
        followStatusLoading ? (
          <div className="shimmer h-8 w-10 rounded-lg" />
        ) : following ? (
          <Unfollow profile={profile} setFollowing={setFollowing} />
        ) : null
      ) : null}
    </div>
  );
};

export default memo(UserProfile);
