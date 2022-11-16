import type { Profile } from '@generated/types';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

import Follow from './Follow';
import Markup from './Markup';
import Slug from './Slug';
import SuperFollow from './SuperFollow';
import UserPreview from './UserPreview';

interface Props {
  profile: Profile;
  showBio?: boolean;
  showFollow?: boolean;
  followStatusLoading?: boolean;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
}

const UserProfile: FC<Props> = ({
  profile,
  showBio = false,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
  linkToProfile = true
}) => {
  const [following, setFollowing] = useState(isFollowing);

  const UserAvatarNFT = () => {
    return (
      <div>
        <img
          style={{
            // @ts-ignore
            'clip-path': 'url("#hex-hw-shapeclip-clipconfig")',
            'background-image': `url(${getAvatar(profile)})`,
            'background-position': 'center',
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
          }}
          height={isBig ? 56 : 40}
          width={isBig ? 56 : 40}
          alt={''}
        />

        <svg height="0" viewBox="0 0 400 376" width="0">
          <defs>
            <clipPath
              clipPathUnits="objectBoundingBox"
              id="hex-hw-shapeclip-clipconfig"
              transform="scale(0.005 0.005319148936170213)"
            >
              <path d="M193.248 69.51C185.95 54.1634 177.44 39.4234 167.798 25.43L164.688 20.96C160.859 15.4049 155.841 10.7724 149.998 7.3994C144.155 4.02636 137.633 1.99743 130.908 1.46004L125.448 1.02004C108.508 -0.340012 91.4873 -0.340012 74.5479 1.02004L69.0879 1.46004C62.3625 1.99743 55.8413 4.02636 49.9981 7.3994C44.155 10.7724 39.1367 15.4049 35.3079 20.96L32.1979 25.47C22.5561 39.4634 14.0458 54.2034 6.74789 69.55L4.39789 74.49C1.50233 80.5829 0 87.2441 0 93.99C0 100.736 1.50233 107.397 4.39789 113.49L6.74789 118.43C14.0458 133.777 22.5561 148.517 32.1979 162.51L35.3079 167.02C39.1367 172.575 44.155 177.208 49.9981 180.581C55.8413 183.954 62.3625 185.983 69.0879 186.52L74.5479 186.96C91.4873 188.32 108.508 188.32 125.448 186.96L130.908 186.52C137.638 185.976 144.163 183.938 150.006 180.554C155.85 177.17 160.865 172.526 164.688 166.96L167.798 162.45C177.44 148.457 185.95 133.717 193.248 118.37L195.598 113.43C198.493 107.337 199.996 100.676 199.996 93.93C199.996 87.1841 198.493 80.5229 195.598 74.43L193.248 69.51Z" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  };

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

  const UserInfo: FC = () => {
    return (
      <UserPreview isBig={isBig} profile={profile} followStatusLoading={followStatusLoading}>
        <div className="flex items-center space-x-3">
          <UserAvatarNFT />
          <div>
            <UserName />
            {showBio && profile?.bio && (
              <div className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify leading-6')}>
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
