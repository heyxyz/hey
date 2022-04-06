import { Profile } from '@generated/types'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { isVerified } from '@lib/isVerified'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState } from 'react'

import Follow from './Follow'
import Slug from './Slug'
import Unfollow from './Unfollow'

const UserPopover = dynamic(() => import('./Popover/UserPopover'))

interface Props {
  profile: Profile
  showFollow?: boolean
  followStatusLoading?: boolean
  isFollowing?: boolean
}

const UserProfile: React.FC<Props> = ({
  profile,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false
}) => {
  const [following, setFollowing] = useState<boolean>(isFollowing)

  return (
    <div className="flex justify-between items-center">
      <Link href={`/u/${profile?.handle}`}>
        <a>
          <div className="flex items-center space-x-3">
            <UserPopover profileId={profile?.id}>
              <img
                src={getAvatar(profile)}
                className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700"
                alt={profile?.handle}
              />
            </UserPopover>
            <UserPopover profileId={profile?.id}>
              <div>
                <div className="flex gap-1 items-center">
                  <div>{profile?.name ?? profile?.handle}</div>
                  {isVerified(profile?.id) && (
                    <BadgeCheckIcon className="w-4 h-4 text-brand-500" />
                  )}
                </div>
                {profile?.name ? (
                  <Slug className="text-sm" slug={profile?.handle} prefix="@" />
                ) : (
                  <Slug
                    className="text-sm"
                    slug={formatUsername(profile?.ownedBy)}
                  />
                )}
              </div>
            </UserPopover>
          </div>
        </a>
      </Link>
      {showFollow &&
        (followStatusLoading ? (
          <div className="w-10 h-8 rounded-lg shimmer" />
        ) : following ? (
          <Unfollow profile={profile} setFollowing={setFollowing} />
        ) : (
          <Follow profile={profile} setFollowing={setFollowing} />
        ))}
    </div>
  )
}

export default UserProfile
