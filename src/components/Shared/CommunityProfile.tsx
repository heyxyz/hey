import { Community } from '@generated/lenstertypes'
import { UsersIcon } from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import Link from 'next/link'
import React from 'react'

interface Props {
  community: Community
}

const CommunityProfile: React.FC<Props> = ({ community }) => {
  return (
    <div className="flex justify-between items-center">
      <Link href={`/communities/${community?.pubId}`}>
        <a>
          <div className="flex items-center space-x-3">
            <img
              src={
                community?.metadata?.cover?.original?.url
                  ? community?.metadata?.cover?.original?.url
                  : `https://avatar.tobi.sh/${community?.pubId}.png`
              }
              className="w-16 h-16 bg-gray-200 rounded-xl border dark:border-gray-700"
              alt={community?.pubId}
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
