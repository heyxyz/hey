import Follow from '@components/Shared/Follow'
import Markup from '@components/Shared/Markup'
import Slug from '@components/Shared/Slug'
import SuperFollow from '@components/Shared/SuperFollow'
import Unfollow from '@components/Shared/Unfollow'
import { Button } from '@components/UI/Button'
import { Tooltip } from '@components/UI/Tooltip'
import { Profile } from '@generated/types'
import {
  CogIcon,
  HashtagIcon,
  LocationMarkerIcon
} from '@heroicons/react/outline'
import { BadgeCheckIcon, ShieldCheckIcon } from '@heroicons/react/solid'
import formatAddress from '@lib/formatAddress'
import getAttribute from '@lib/getAttribute'
import getAvatar from '@lib/getAvatar'
import isStaff from '@lib/isStaff'
import isVerified from '@lib/isVerified'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { STATIC_ASSETS } from 'src/constants'
import { useAppPersistStore } from 'src/store/app'

import Badges from './Badges'
import Followerings from './Followerings'
import ProfileMod from './Mod'

interface Props {
  profile: Profile
}

const Details: FC<Props> = ({ profile }) => {
  const [followersCount, setFollowersCount] = useState<number>(0)
  const [following, setFollowing] = useState<boolean>(profile?.isFollowedByMe)
  const currentUser = useAppPersistStore((state) => state.currentUser)
  const staffMode = useAppPersistStore((state) => state.staffMode)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (profile?.stats?.totalFollowers) {
      setFollowersCount(profile?.stats?.totalFollowers)
    }
  }, [profile?.stats?.totalFollowers])

  const MetaDetails = ({
    children,
    icon
  }: {
    children: ReactElement
    icon: ReactElement
  }) => (
    <div className="flex gap-2 items-center">
      {icon}
      <div className="truncate text-md">{children}</div>
    </div>
  )

  const followType = profile?.followModule?.__typename

  return (
    <div className="px-5 mb-4 space-y-5 sm:px-0">
      <div className="relative -mt-24 w-32 h-32 sm:-mt-32 sm:w-52 sm:h-52">
        <img
          src={getAvatar(profile)}
          className="w-32 h-32 bg-gray-200 rounded-xl ring-8 ring-gray-50 sm:w-52 sm:h-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          width={128}
          alt={profile?.handle}
        />
      </div>
      <div className="py-2 space-y-1">
        <div className="flex gap-1.5 items-center text-2xl font-bold">
          <div className="truncate">{profile?.name ?? profile?.handle}</div>
          {isVerified(profile?.id) && (
            <Tooltip content="Verified">
              <BadgeCheckIcon className="w-6 h-6 text-brand" />
            </Tooltip>
          )}
          {isStaff(profile?.id) && (
            <Tooltip content="Staff">
              <ShieldCheckIcon className="w-6 h-6 text-green-500" />
            </Tooltip>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {profile?.name ? (
            <Slug
              className="!text-sm sm:!text-base"
              slug={profile?.handle}
              prefix="@"
            />
          ) : (
            <Slug
              className="!text-sm sm:!text-base"
              slug={formatAddress(profile?.ownedBy)}
            />
          )}
          {currentUser &&
            currentUser?.id !== profile?.id &&
            profile?.isFollowing && (
              <div className="py-0.5 px-2 text-xs bg-gray-200 rounded-full dark:bg-gray-700">
                Follows you
              </div>
            )}
        </div>
      </div>
      <div className="space-y-5">
        <Followerings followersCount={followersCount} profile={profile} />
        <div className="flex items-center space-x-2">
          {followType !== 'RevertFollowModuleSettings' ? (
            following ? (
              <div className="flex space-x-2">
                <Unfollow
                  profile={profile}
                  setFollowing={setFollowing}
                  followersCount={followersCount}
                  setFollowersCount={setFollowersCount}
                  showText
                />
                {followType === 'FeeFollowModuleSettings' && (
                  <SuperFollow
                    profile={profile}
                    setFollowing={setFollowing}
                    followersCount={followersCount}
                    setFollowersCount={setFollowersCount}
                    again
                  />
                )}
              </div>
            ) : followType === 'FeeFollowModuleSettings' ? (
              <SuperFollow
                profile={profile}
                setFollowing={setFollowing}
                followersCount={followersCount}
                setFollowersCount={setFollowersCount}
                showText
              />
            ) : (
              <Follow
                profile={profile}
                setFollowing={setFollowing}
                followersCount={followersCount}
                setFollowersCount={setFollowersCount}
                showText
              />
            )
          ) : null}
          {currentUser?.id === profile?.id && (
            <Link href="/settings">
              <a href="/settings">
                <Button
                  variant="secondary"
                  className="!py-1.5"
                  icon={<CogIcon className="w-5 h-5" />}
                />
              </a>
            </Link>
          )}
        </div>
        {profile?.bio && (
          <div className="mr-0 sm:mr-10 leading-md linkify text-md">
            <Markup>{profile?.bio}</Markup>
          </div>
        )}
        <div className="w-full divider" />
        <div className="space-y-2">
          <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
            <Tooltip content={`#${parseInt(profile?.id)}`}>
              {profile?.id}
            </Tooltip>
          </MetaDetails>
          {getAttribute(profile?.attributes, 'location') && (
            <MetaDetails icon={<LocationMarkerIcon className="w-4 h-4" />}>
              {getAttribute(profile?.attributes, 'location') as any}
            </MetaDetails>
          )}
          {profile?.onChainIdentity?.ens?.name && (
            <MetaDetails
              icon={
                <img
                  src={`${STATIC_ASSETS}/brands/ens.svg`}
                  className="w-4 h-4"
                  height={16}
                  width={16}
                  alt="ENS Logo"
                />
              }
            >
              {profile?.onChainIdentity?.ens?.name}
            </MetaDetails>
          )}
          {getAttribute(profile?.attributes, 'website') && (
            <MetaDetails
              icon={
                <img
                  src={`https://www.google.com/s2/favicons?domain=${getAttribute(
                    profile?.attributes,
                    'website'
                  )
                    ?.replace('https://', '')
                    .replace('http://', '')}`}
                  className="w-4 h-4 rounded-full"
                  height={16}
                  width={16}
                  alt="Website"
                />
              }
            >
              <a
                href={`https://${getAttribute(profile?.attributes, 'website')
                  ?.replace('https://', '')
                  .replace('http://', '')}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {getAttribute(profile?.attributes, 'website')
                  ?.replace('https://', '')
                  .replace('http://', '')}
              </a>
            </MetaDetails>
          )}
          {getAttribute(profile?.attributes, 'twitter') && (
            <MetaDetails
              icon={
                resolvedTheme === 'dark' ? (
                  <img
                    src={`${STATIC_ASSETS}/brands/twitter-light.svg`}
                    className="w-4 h-4"
                    height={16}
                    width={16}
                    alt="Twitter Logo"
                  />
                ) : (
                  <img
                    src={`${STATIC_ASSETS}/brands/twitter-dark.svg`}
                    className="w-4 h-4"
                    height={16}
                    width={16}
                    alt="Twitter Logo"
                  />
                )
              }
            >
              <a
                href={`https://twitter.com/${getAttribute(
                  profile?.attributes,
                  'twitter'
                )}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {getAttribute(profile?.attributes, 'twitter')?.replace(
                  'https://twitter.com/',
                  ''
                )}
              </a>
            </MetaDetails>
          )}
        </div>
      </div>
      <Badges profile={profile} />
      {isStaff(currentUser?.id) && staffMode && (
        <ProfileMod profile={profile} />
      )}
    </div>
  )
}

export default Details
