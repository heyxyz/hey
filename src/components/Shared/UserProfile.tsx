import MutualFollowers from '@components/Profile/MutualFollowers';
import type { Profile } from '@generated/types';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

import Follow from './Follow';
import Markup from './Markup';
import Slug from './Slug';
import SuperFollow from './SuperFollow';

interface Props {
  profile: Profile;
  showBio?: boolean;
  showFollow?: boolean;
  followStatusLoading?: boolean;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
  showPreviewCard?: boolean;
}

const UserProfile: FC<Props> = ({
  profile,
  showBio = false,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
  linkToProfile = true,
  showPreviewCard = false
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const [showPreview, setShowPreview] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const UserImage = () => (
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
    <div className="absolute w-64 p-3 top-12 bg-white dark:bg-black border dark:border-gray-700 rounded-xl z-[1]">
      <div className="flex justify-between items-center">
        <UserImage />
        <div onClick={(e) => e.preventDefault()}>
          {!profile.isFollowedByMe &&
            (followStatusLoading ? (
              <div className="w-10 h-8 rounded-lg shimmer" />
            ) : profile?.followModule?.__typename === 'FeeFollowModuleSettings' ? (
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
            <div className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify leading-6')}>
              <Markup>{profile?.bio}</Markup>
            </div>
          )}
        </div>
        <div className="flex space-x-3 items-center">
          <div className="flex items-center space-x-1">
            <div className="text-base">{profile?.stats?.totalFollowing}</div>
            <div className="text-gray-500 text-sm">Following</div>
          </div>
          <div className="flex items-center space-x-1 text-md">
            <div className="text-base">{profile?.stats?.totalFollowers}</div>
            <div className="text-gray-500 text-sm">Followers</div>
          </div>
        </div>
        {currentProfile && <MutualFollowers profile={profile} variant="xs" />}
      </div>
    </div>
  );

  const UserInfo: FC = () => {
    let previewTimer = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const onPreviewEnd = () => {
      if (!showPreviewCard) {
        return;
      }
      setShowPreview(false);
      if (previewTimer.current) {
        clearInterval(previewTimer.current);
      }
      previewTimer.current = null;
    };

    useEffect(() => {
      if (!showPreviewCard) {
        return;
      }
      const handleHoverOutside = (event: any) => {
        if (wrapperRef.current && !wrapperRef.current?.contains(event.target)) {
          onPreviewEnd();
        }
      };
      document.addEventListener('mouseleave', handleHoverOutside);
      return () => {
        document.removeEventListener('mouseleave', handleHoverOutside);
      };
    }, [wrapperRef]);

    const onPreviewStart = () => {
      if (!showPreviewCard) {
        return;
      }
      if (previewTimer.current) {
        clearInterval(previewTimer.current);
        previewTimer.current = null;
      }
      const timer = setTimeout(() => {
        setShowPreview(true);
      }, 600);
      previewTimer.current = timer;
    };

    return (
      <div
        className="relative flex items-center space-x-3"
        onMouseOver={onPreviewStart}
        onMouseLeave={onPreviewEnd}
        ref={wrapperRef}
      >
        <UserImage />
        {showPreview && <Preview />}
        <div>
          <UserName />
          {showBio && profile?.bio && (
            <div className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify leading-6')}>
              <Markup>{profile?.bio}</Markup>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between items-center">
      {linkToProfile ? (
        <Link href={`/u/${profile?.handle}`}>
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
          <Follow profile={profile} setFollowing={setFollowing} />
        ))}
    </div>
  );
};

export default UserProfile;
