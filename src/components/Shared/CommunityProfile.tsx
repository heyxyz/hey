import { Community } from '@generated/lenstertypes'
import { UsersIcon } from '@heroicons/react/outline'
import humanize from '@lib/humanize'
import imagekitURL from '@lib/imagekitURL'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
  community: Community
}

const CommunityProfile: FC<Props> = ({ community }) => {
  return (
    <div className="flex items-center justify-between">
      <Link href={`/communities/${community?.id}`}>
        <a>
          <div className="flex items-center space-x-3">
            <img
              src={imagekitURL(
                community?.metadata?.cover?.original?.url
                  ? community?.metadata?.cover?.original?.url
                  : `https://avatar.tobi.sh/${community?.id}.png`,
                500,
                500
              )}
              className="w-16 h-16 bg-gray-200 border rounded-xl dark:border-gray-700"
              alt={community?.id}
            />
            <div className="space-y-1">
              <div className="">{community?.metadata?.name}</div>
              <div className="text-sm text-gray-500">
                {community?.metadata?.description}
              </div>
              {community?.stats?.totalAmountOfCollects !== 0 && (
                <div className="flex items-center space-x-1 text-sm">
                  <UsersIcon className="w-3 h-3" />
                  <div>
                    {humanize(community?.stats?.totalAmountOfCollects)}{' '}
                    {community?.stats?.totalAmountOfCollects > 1
                      ? 'members'
                      : 'member'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default CommunityProfile
