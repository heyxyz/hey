import type { FC } from 'react';

import Unfollow from '@components/Shared/Profile/Unfollow';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { FollowModuleType, type Profile } from '@hey/lens';
import formatRelativeOrAbsolute from '@hey/lib/datetime/formatRelativeOrAbsolute';
import getAvatar from '@hey/lib/getAvatar';
import getMentions from '@hey/lib/getMentions';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import isVerified from '@lib/isVerified';
import Link from 'next/link';
import { memo } from 'react';

import Markup from './Markup';
import Follow from './Profile/Follow';
import Slug from './Slug';
import SuperFollow from './SuperFollow';
import UserPreview from './UserPreview';

interface UserProfileProps {
  // For data analytics
  isBig?: boolean;
  linkToProfile?: boolean;
  profile: Profile;
  showBio?: boolean;
  showFollow?: boolean;
  showUnfollow?: boolean;

  showUserPreview?: boolean;
  timestamp?: Date;
}

const UserProfile: FC<UserProfileProps> = ({
  isBig = false,
  linkToProfile = true,
  profile,
  showBio = false,
  showFollow = false,
  showUnfollow = false,
  showUserPreview = true,
  timestamp = ''
}) => {
  const UserAvatar = () => (
    <Image
      alt={profile.id}
      className={cn(
        isBig ? 'size-14' : 'size-10',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={isBig ? 56 : 40}
      loading="lazy"
      src={getAvatar(profile)}
      width={isBig ? 56 : 40}
    />
  );

  const UserName = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={cn(isBig ? 'font-bold' : 'text-md', 'grid')}>
          <div className="truncate">{getProfile(profile).displayName}</div>
        </div>
        {isVerified(profile.id) ? (
          <CheckBadgeIcon className="text-brand-500 ml-1 size-4" />
        ) : null}
        {hasMisused(profile.id) ? (
          <ExclamationCircleIcon className="ml-1 size-4 text-red-500" />
        ) : null}
      </div>
      <div>
        <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
        {timestamp ? (
          <span className="ld-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs">
              {formatRelativeOrAbsolute(timestamp)}
            </span>
          </span>
        ) : null}
      </div>
    </>
  );

  const UserInfo: FC = () => {
    return (
      <UserPreview
        handle={profile.handle?.fullHandle}
        id={profile.id}
        showUserPreview={showUserPreview}
      >
        <div className="mr-8 flex items-center space-x-3">
          <UserAvatar />
          <div>
            <UserName />
            {showBio && profile?.metadata?.bio ? (
              <div
                className={cn(
                  isBig ? 'text-base' : 'text-sm',
                  'mt-2',
                  'linkify leading-6'
                )}
                // Replace with Tailwind
                style={{ wordBreak: 'break-word' }}
              >
                <Markup mentions={getMentions(profile.metadata.bio)}>
                  {profile?.metadata.bio}
                </Markup>
              </div>
            ) : null}
          </div>
        </div>
      </UserPreview>
    );
  };

  return (
    <div className="flex items-center justify-between">
      {linkToProfile && profile.id ? (
        <Link
          className="outline-brand-500 rounded-xl outline-offset-4"
          href={getProfile(profile).link}
        >
          <UserInfo />
        </Link>
      ) : (
        <UserInfo />
      )}
      {showFollow ? (
        profile.operations.isFollowedByMe.value ? null : profile?.followModule
            ?.type === FollowModuleType.FeeFollowModule ? (
          <SuperFollow profile={profile} />
        ) : (
          <Follow profile={profile} />
        )
      ) : null}
      {showUnfollow ? (
        profile.operations.isFollowedByMe.value ? (
          <Unfollow profile={profile} />
        ) : null
      ) : null}
    </div>
  );
};

export default memo(UserProfile);
