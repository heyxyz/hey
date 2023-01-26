import { BadgeCheckIcon } from '@heroicons/react/solid';
import formatHandle from '@lib/formatHandle';
import formatTime from '@lib/formatTime';
import getAttribute from '@lib/getAttribute';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import clsx from 'clsx';
import dayjs from 'dayjs';
// @ts-ignore
import dayjsTwitter from 'dayjs-twitter';
import type { Profile } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

import Follow from './Follow';
import Markup from './Markup';
import Slug from './Slug';
import SuperFollow from './SuperFollow';
import UserPreview from './UserPreview';

dayjs.extend(dayjsTwitter);

interface Props {
  profile: Profile;
  followStatusLoading?: boolean;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
  showBio?: boolean;
  showFollow?: boolean;
  showStatus?: boolean;
  showUserPreview?: boolean;
  timestamp?: Date;

  // For data analytics
  followPosition?: number;
  followSource?: string;
}

const UserProfile: FC<Props> = ({
  profile,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
  linkToProfile = true,
  showBio = false,
  showFollow = false,
  showStatus = false,
  showUserPreview = true,
  timestamp = '',
  followPosition,
  followSource
}) => {
  const [following, setFollowing] = useState(isFollowing);

  const statusEmoji = getAttribute(profile?.attributes, 'statusEmoji');
  const statusMessage = getAttribute(profile?.attributes, 'statusMessage');
  const hasStatus = statusEmoji && statusMessage;

  const UserAvatar = () => (
    <img
      onError={({ currentTarget }) => {
        currentTarget.src = getAvatar(profile, false);
      }}
      src={getAvatar(profile)}
      loading="lazy"
      className={clsx(
        isBig ? 'w-14 h-14' : 'w-10 h-10',
        'bg-gray-200 rounded-full border dark:border-gray-700'
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={formatHandle(profile?.handle)}
    />
  );

  const UserName = () => (
    <>
      <div className="flex items-center max-w-sm truncate">
        <div className={clsx(isBig ? 'font-bold' : 'text-md')}>
          {profile?.name ?? formatHandle(profile?.handle)}
        </div>
        {isVerified(profile?.id) && <BadgeCheckIcon className="w-4 h-4 text-brand ml-1" />}
        {showStatus && hasStatus ? (
          <div className="flex items-center lt-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs flex items-center space-x-1 max-w-[10rem]">
              <span>{statusEmoji}</span>
              <span className="truncate">{statusMessage}</span>
            </span>
          </div>
        ) : null}
      </div>
      <div>
        <Slug className="text-sm" slug={formatHandle(profile?.handle)} prefix="@" />
        {timestamp ? (
          <span className="lt-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs" title={formatTime(timestamp as Date)}>
              {/* @ts-ignore */}
              {dayjs(new Date(timestamp)).twitter()}
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
        <div className="flex items-center space-x-3">
          <UserAvatar />
          <div>
            <UserName />
            {showBio && profile?.bio && (
              <div
                // Replace with Tailwind
                style={{ wordBreak: 'break-word' }}
                className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify leading-6')}
              >
                <Markup>{profile?.bio}</Markup>
              </div>
            )}
          </div>
        </div>
      </UserPreview>
    );
  };

  return (
    <div className="flex justify-between items-center">
      {linkToProfile ? (
        <Link href={`/u/${formatHandle(profile?.handle)}`}>
          <UserInfo />
        </Link>
      ) : (
        <UserInfo />
      )}
      {showFollow &&
        (followStatusLoading ? (
          <div className="w-10 h-8 rounded-lg shimmer" />
        ) : following ? null : profile?.followModule?.__typename === 'FeeFollowModuleSettings' ? (
          <SuperFollow profile={profile} setFollowing={setFollowing} />
        ) : (
          <Follow
            profile={profile}
            setFollowing={setFollowing}
            followPosition={followPosition}
            followSource={followSource}
          />
        ))}
    </div>
  );
};

export default UserProfile;
