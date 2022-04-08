import { useQuery } from '@apollo/client'
import { PROFILE_QUERY } from '@components/Profile'
import { Card } from '@components/UI/Card'
import { Tooltip } from '@components/UI/Tooltip'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { humanize } from '@lib/humanize'
import { imagekitURL } from '@lib/imagekitURL'
import { isVerified } from '@lib/isVerified'
import { linkifyOptions } from '@lib/linkifyOptions'
import Linkify from 'linkify-react'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

import Slug from '../../Slug'

interface Props {
  handle: string
  showPopover: boolean
}

const Content: React.FC<Props> = ({ handle, showPopover }) => {
  const { data } = useQuery(PROFILE_QUERY, {
    variables: { request: { handles: handle } },
    skip: !handle || !showPopover
  })

  const profile = data?.profiles?.items[0]

  return (
    <Card className="dark:!bg-gray-800 dark:border-gray-600">
      <div
        className="h-28 rounded-t-xl"
        style={{
          backgroundImage: `url(${
            profile?.coverPicture?.original?.url
              ? imagekitURL(profile?.coverPicture?.original?.url)
              : `${STATIC_ASSETS}/patterns/2.svg`
          })`,
          backgroundColor: '#8b5cf6',
          backgroundSize: profile?.coverPicture?.original?.url
            ? 'cover'
            : '30%',
          backgroundPosition: 'center center',
          backgroundRepeat: profile?.coverPicture?.original?.url
            ? 'no-repeat'
            : 'repeat'
        }}
      />
      <div className="w-80 p-5 -mt-14">
        <div className="space-y-1">
          <img
            src={getAvatar(profile)}
            className="w-16 h-16 bg-gray-200 rounded-full ring-4 ring-gray-50 dark:bg-gray-700 dark:ring-gray-800"
            alt={profile?.handle}
          />
          <div>
            <div className="flex gap-1.5 items-center font-bold truncate">
              <div className="truncate">{profile?.name ?? profile?.handle}</div>
              {isVerified(profile?.id) && (
                <Tooltip content="Verified">
                  <BadgeCheckIcon className="w-5 h-5 text-brand-500" />
                </Tooltip>
              )}
            </div>
            <div className="text-sm">
              {profile?.name ? (
                <Slug slug={formatUsername(profile?.handle)} prefix="@" />
              ) : (
                <Slug slug={formatUsername(profile?.ownedBy)} />
              )}
            </div>
          </div>
          {profile?.bio && (
            <div className="leading-6 text-sm pt-2 w-fit linkify">
              <Linkify tagName="div" options={linkifyOptions}>
                {profile?.bio}
              </Linkify>
            </div>
          )}
          <div className="text-sm flex pt-2 space-x-3">
            <div className="space-x-1">
              <span className="font-bold">
                {humanize(profile?.stats?.totalFollowing)}
              </span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="space-x-1">
              <span className="font-bold">
                {humanize(profile?.stats?.totalFollowers)}
              </span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Content
