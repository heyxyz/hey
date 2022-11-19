import MutualFollowers from '@components/Profile/MutualFollowers';
import type { Profile } from '@generated/types';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import nFormatter from '@lib/nFormatter';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useAppStore } from 'src/store/app';

import Follow from './Follow';
import Markup from './Markup';
import Slug from './Slug';
import SuperFollow from './SuperFollow';

type Props = {
  profile: Profile;
  children: React.ReactNode;
  isBig?: boolean;
  followStatusLoading?: boolean;
};

const UserPreview: FC<Props> = ({ profile, isBig, followStatusLoading, children }) => {
  const [showPreview, setShowPreview] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [following, setFollowing] = useState(profile?.isFollowedByMe);

  const UserAvatar = () => (
    <img
      src={getAvatar(profile)}
      loading="lazy"
      className={clsx(
        isBig ? 'w-14 h-14' : 'w-10 h-10',
        'bg-gray-200 rounded-full border dark:border-gray-700/80'
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={profile?.handle}
    />
  );

  const UserName = () => (
    <>
      <div className="flex gap-1 items-center max-w-sm truncate">
        <div className={clsx(isBig ? 'font-bold' : 'text-md')}>{profile?.name ?? profile?.handle}</div>
        {isVerified(profile?.id) && <BadgeCheckIcon className="w-4 h-4 text-brand" />}
      </div>
      <Slug className="text-sm" slug={profile?.handle} prefix="@" />
    </>
  );

  const Preview = () => (
    <>
      <div className="flex justify-between items-center">
        <UserAvatar />
        <div onClick={(e) => e.preventDefault()}>
          {!profile.isFollowedByMe &&
            (followStatusLoading ? (
              <div className="w-10 h-8 rounded-lg shimmer" />
            ) : following ? null : profile?.followModule?.__typename === 'FeeFollowModuleSettings' ? (
              <SuperFollow profile={profile} setFollowing={setFollowing} />
            ) : (
              <Follow profile={profile} setFollowing={setFollowing} />
            ))}
        </div>
      </div>
      <div className="p-1 space-y-3">
        <UserName />
        <div>
          {profile?.bio && (
            <div className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify break-words leading-6')}>
              <Markup>{profile?.bio}</Markup>
            </div>
          )}
        </div>
        <div className="flex space-x-3 items-center">
          <div className="flex items-center space-x-1">
            <div className="text-base">{nFormatter(profile?.stats?.totalFollowing)}</div>
            <div className="text-gray-500 text-sm">Following</div>
          </div>
          <div className="flex items-center space-x-1 text-md">
            <div className="text-base">{nFormatter(profile?.stats?.totalFollowers)}</div>
            <div className="text-gray-500 text-sm">Followers</div>
          </div>
        </div>
        {currentProfile && <MutualFollowers profile={profile} variant="xs" />}
      </div>
    </>
  );

  const onPreviewEnd = () => {
    setShowPreview(false);
  };

  const onPreviewStart = () => {
    setShowPreview(true);
  };

  return (
    <div onMouseOver={onPreviewStart} onMouseLeave={onPreviewEnd}>
      {showPreview ? (
        <Tippy
          placement="bottom-start"
          delay={[800, 0]}
          hideOnClick={false}
          content={<Preview />}
          arrow={false}
          interactive
          zIndex={1000}
          className="!bg-white hidden md:block !px-1.5 !py-3 !text-black dark:!text-white w-64 dark:!bg-black border dark:border-gray-700 !rounded-xl"
        >
          <span>{children}</span>
        </Tippy>
      ) : (
        <span>{children}</span>
      )}
    </div>
  );
};

export default UserPreview;
