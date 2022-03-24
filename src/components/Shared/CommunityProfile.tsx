import Join from '@components/Community/Join'
import { Community } from '@generated/lenstertypes'
import Link from 'next/link'
import React, { useState } from 'react'

interface Props {
  community: Community
  showJoin?: boolean
  hasJoined?: boolean
}

const CommunityProfile: React.FC<Props> = ({
  community,
  showJoin = false,
  hasJoined = false
}) => {
  const [joined, setJoined] = useState<boolean>(hasJoined)

  return (
    <div className="flex items-center justify-between">
      <Link href={`/communities/${community?.pubId}`}>
        <a>
          <div className="flex items-center space-x-3">
            <img
              src={
                community?.metadata?.cover?.original?.url
                  ? community?.metadata?.cover?.original?.url
                  : `https://avatar.tobi.sh/${community?.pubId}.png`
              }
              className="w-10 h-10 bg-gray-200 border rounded-full dark:border-gray-700"
              alt={community?.pubId}
            />
            <div>
              <div className="flex items-center gap-1">
                <div>{community?.metadata?.name}</div>
              </div>
            </div>
          </div>
        </a>
      </Link>
      {!joined && <Join community={community} setJoined={setJoined} />}
    </div>
  )
}

export default CommunityProfile
