import { Profile } from '@generated/types'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import getAvatar from '@lib/getAvatar'
import isVerified from '@lib/isVerified'
import Link from 'next/link'
import React, { FC, useState } from 'react'

import Follow from './Follow'
import Slug from './Slug'
import SuperFollow from './SuperFollow'
import Unfollow from './Unfollow'

interface Props {
  profile: Profile
  showBio?: boolean
  showFollow?: boolean
  followStatusLoading?: boolean
  isFollowing?: boolean
}

const UserProfile: FC<Props> = ({
  profile,
  showBio = false,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false
}) => {
  const [following, setFollowing] = useState<boolean>(isFollowing)

  return (
    <div className="flex items-center justify-between">
      <Link href={`/u/${profile?.handle}`}>
        <a>
          <div className="flex items-center space-x-3">
            <img
              src={getAvatar(profile)}
              className="w-10 h-10 bg-gray-200 border rounded-full dark:border-gray-800"
              alt={profile?.handle}
            />
            <div>
              <div className="flex items-center gap-1">
                <div>{profile?.name ?? profile?.handle}</div>
                {isVerified(profile?.id) && (
                  <BadgeCheckIcon className="w-4 h-4 text-brand-500" />
                )}
              </div>
              <Slug className="text-sm" slug={profile?.handle} prefix="@" />
              {showBio && profile?.bio && (
                <div className="mt-2 text-sm">{profile?.bio}</div>
              )}
            </div>
          </div>
        </a>
      </Link>
      {showFollow &&
        (followStatusLoading ? (
          <div className="w-10 h-8 rounded-lg shimmer" />
        ) : following ? (
          <Unfollow profile={profile} setFollowing={setFollowing} />
        ) : profile?.followModule ? (
          <SuperFollow profile={profile} setFollowing={setFollowing} />
        ) : (
          <Follow profile={profile} setFollowing={setFollowing} />
        ))}
    </div>
  )
}

export default UserProfile
