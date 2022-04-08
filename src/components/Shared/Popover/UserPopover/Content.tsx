import { useQuery } from '@apollo/client'
import { PROFILE_QUERY } from '@components/Profile'
import { Card, CardBody } from '@components/UI/Card'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { humanize } from '@lib/humanize'
import { isStaff } from '@lib/isStaff'
import { isVerified } from '@lib/isVerified'
import { linkifyOptions } from '@lib/linkifyOptions'
import Linkify from 'linkify-react'
import React from 'react'

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

  if (!data) return null

  const profile = data?.profiles?.items[0]

  return (
    <Card
      className="dark:!bg-gray-800 dark:border-gray-600 shadow-sm"
      forceRounded
    >
      <CardBody className="w-72">
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
                <BadgeCheckIcon className="w-5 h-5 text-brand-500" />
              )}
              {isStaff(profile.id) && (
                <div className="py-0.5 px-2 text-xs text-white rounded-lg shadow-sm bg-brand-500 w-fit">
                  Staff
                </div>
              )}
            </div>
            <Slug
              className="text-sm"
              slug={formatUsername(profile?.handle)}
              prefix="@"
            />
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
      </CardBody>
    </Card>
  )
}

export default Content
