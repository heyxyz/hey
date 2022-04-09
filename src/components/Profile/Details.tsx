import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import Follow from '@components/Shared/Follow'
import Slug from '@components/Shared/Slug'
import Unfollow from '@components/Shared/Unfollow'
import { Button } from '@components/UI/Button'
import { Tooltip } from '@components/UI/Tooltip'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import {
  HashtagIcon,
  LocationMarkerIcon,
  PencilAltIcon
} from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import formatAddress from '@lib/formatAddress'
import { getAvatar } from '@lib/getAvatar'
import { isStaff } from '@lib/isStaff'
import { isVerified } from '@lib/isVerified'
import { linkifyOptions } from '@lib/linkifyOptions'
import Linkify from 'linkify-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useContext, useState } from 'react'
import { STATIC_ASSETS } from 'src/constants'
import { useEnsLookup } from 'wagmi'

import DoesFollow from './DoesFollow'
import Followerings from './Followerings'
import ProfileMod from './Mod'

export const DOES_FOLLOW_QUERY = gql`
  query DoesFollow($request: DoesFollowRequest!) {
    doesFollow(request: $request) {
      follows
    }
  }
`

interface Props {
  profile: Profile
}

const Details: React.FC<Props> = ({ profile }) => {
  const [following, setFollowing] = useState<boolean>(false)
  const { currentUser, staffMode } = useContext(AppContext)
  const [{ data: ensName }] = useEnsLookup({ address: profile?.ownedBy })
  const { resolvedTheme } = useTheme()
  const { data: followData, loading: followLoading } = useQuery(
    DOES_FOLLOW_QUERY,
    {
      variables: {
        request: {
          followInfos: [
            {
              // Am I following them
              followerAddress: profile.ownedBy,
              profileId: currentUser?.id
            },
            {
              // Do they follow me
              followerAddress: currentUser?.ownedBy,
              profileId: profile.id
            }
          ]
        }
      },
      skip: !profile || !currentUser,
      onCompleted(data) {
        setFollowing(data?.doesFollow[1]?.follows)
      }
    }
  )

  const MetaDetails = ({
    children,
    icon
  }: {
    children: React.ReactChild
    icon: React.ReactChild
  }) => (
    <div className="flex gap-2 items-center">
      {icon}
      {children}
    </div>
  )

  return (
    <div className="px-5 mb-4 sm:px-0 space-y-5">
      <div className="relative -mt-24 w-32 h-32 sm:-mt-32 sm:w-52 sm:h-52">
        <img
          src={getAvatar(profile)}
          className="w-32 h-32 bg-gray-200 rounded-xl ring-8 ring-gray-50 sm:w-52 sm:h-52 dark:bg-gray-700 dark:ring-black"
          alt={profile?.handle}
        />
      </div>
      <div className="py-2 space-y-1">
        <div className="flex gap-1.5 items-center text-2xl font-bold">
          <div className="truncate">{profile?.name ?? profile?.handle}</div>
          {isVerified(profile?.id) && (
            <Tooltip content="Verified">
              <BadgeCheckIcon className="w-6 h-6 text-brand-500" />
            </Tooltip>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {profile?.name ? (
            <Slug slug={profile?.handle} prefix="@" />
          ) : (
            <Slug slug={formatAddress(profile?.ownedBy)} />
          )}
          {currentUser && currentUser.id !== profile.id && (
            <DoesFollow followData={followData?.doesFollow[0]} />
          )}
        </div>
      </div>
      <div className="space-y-5">
        <Followerings profile={profile} />
        <div className="flex items-center space-x-2">
          {followLoading ? (
            <div className="w-28 rounded-lg h-[34px] shimmer" />
          ) : following ? (
            <Unfollow profile={profile} setFollowing={setFollowing} showText />
          ) : (
            <Follow profile={profile} setFollowing={setFollowing} showText />
          )}
          {currentUser?.id === profile?.id && (
            <Link href="/settings">
              <a>
                <Button
                  variant="secondary"
                  className="!py-1.5"
                  icon={<PencilAltIcon className="w-5 h-5" />}
                />
              </a>
            </Link>
          )}
        </div>
        {profile?.bio && (
          <div className="mr-0 leading-7 sm:mr-10 linkify">
            <Linkify tagName="div" options={linkifyOptions}>
              {profile?.bio}
            </Linkify>
          </div>
        )}
        <div className="space-y-2">
          <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
            {profile?.id}
          </MetaDetails>
          {profile?.location && (
            <MetaDetails icon={<LocationMarkerIcon className="w-4 h-4" />}>
              {profile?.location}
            </MetaDetails>
          )}
        </div>
        {isStaff(profile.id) && (
          <div className="py-0.5 px-2 text-sm text-white rounded-lg shadow-sm bg-brand-500 w-fit">
            Staff
          </div>
        )}
        <div className="space-y-2.5">
          {profile?.website && (
            <MetaDetails
              icon={
                <img
                  src={`https://www.google.com/s2/favicons?domain=${profile?.website}`}
                  className="w-5 h-5 rounded-full"
                  alt="Website"
                />
              }
            >
              <a href={profile?.website} target="_blank" rel="noreferrer">
                {profile?.website}
              </a>
            </MetaDetails>
          )}
          {profile?.twitterUrl && (
            <MetaDetails
              icon={
                resolvedTheme === 'dark' ? (
                  <img
                    src={`${STATIC_ASSETS}/brands/twitter-light.svg`}
                    className="w-5"
                    alt="Twitter Logo"
                  />
                ) : (
                  <img
                    src={`${STATIC_ASSETS}/brands/twitter-dark.svg`}
                    className="w-5"
                    alt="Twitter Logo"
                  />
                )
              }
            >
              <a href={profile?.twitterUrl} target="_blank" rel="noreferrer">
                {profile?.twitterUrl?.replace('https://twitter.com/', '')}
              </a>
            </MetaDetails>
          )}
          {ensName && (
            <MetaDetails
              icon={<img src="/ens.svg" className="w-5 h-5" alt="ENS Logo" />}
            >
              <a
                href={`https://app.ens.domains/name/${ensName}/details`}
                target="_blank"
                rel="noreferrer"
              >
                {ensName}
              </a>
            </MetaDetails>
          )}
        </div>
      </div>
      {isStaff(currentUser?.id) && staffMode && (
        <ProfileMod profile={profile} />
      )}
    </div>
  )
}

export default Details
