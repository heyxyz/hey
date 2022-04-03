import { ProfileStats } from '@generated/types'
import {
  ChatAlt2Icon,
  DuplicateIcon,
  PencilAltIcon,
  PhotographIcon
} from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { trackEvent } from '@lib/trackEvent'
import clsx from 'clsx'
import React, { Dispatch } from 'react'

interface Props {
  stats: ProfileStats
  setFeedType: Dispatch<React.SetStateAction<string>>
  feedType: string
}

const FeedType: React.FC<Props> = ({ stats, setFeedType, feedType }) => {
  interface FeedLinkProps {
    name: string
    icon: React.ReactChild
    type: string
    count?: number
  }

  const FeedLink: React.FC<FeedLinkProps> = ({
    name,
    icon,
    type,
    count = 0
  }) => (
    <button
      onClick={() => {
        trackEvent(`user ${name.toLowerCase()}`)
        setFeedType(type)
      }}
      className={clsx(
        {
          'text-brand-500 bg-brand-100 dark:bg-opacity-20 bg-opacity-100 font-bold':
            feedType === type
        },
        'flex items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand-500 hover:bg-brand-100 hover:text-brand-500 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
    >
      {icon}
      <div className="hidden sm:block">{name}</div>
      {count ? (
        <div className="px-2 text-xs font-medium rounded-full bg-brand-200">
          {humanize(count)}
        </div>
      ) : null}
    </button>
  )

  return (
    <div className="flex gap-3 px-5 mt-3 sm:px-0 sm:mt-0">
      <FeedLink
        name="Posts"
        icon={<PencilAltIcon className="w-4 h-4" />}
        type="POST"
        count={stats?.totalPosts}
      />
      <FeedLink
        name="Comments"
        icon={<ChatAlt2Icon className="w-4 h-4" />}
        type="COMMENT"
        count={stats?.totalComments}
      />
      <FeedLink
        name="Mirrors"
        icon={<DuplicateIcon className="w-4 h-4" />}
        type="MIRROR"
        count={stats?.totalMirrors}
      />
      <FeedLink
        name="NFTs"
        icon={<PhotographIcon className="w-4 h-4" />}
        type="NFT"
      />
    </div>
  )
}

export default FeedType
