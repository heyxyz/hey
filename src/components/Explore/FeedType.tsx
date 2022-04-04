import {
  ChatAlt2Icon,
  ClockIcon,
  CollectionIcon
} from '@heroicons/react/outline'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { Dispatch } from 'react'

interface Props {
  setFeedType: Dispatch<React.SetStateAction<string>>
  feedType: string
}

const FeedType: React.FC<Props> = ({ setFeedType, feedType }) => {
  const router = useRouter()

  interface FeedLinkProps {
    name: string
    icon: React.ReactChild
    type: string
  }

  const FeedLink: React.FC<FeedLinkProps> = ({ name, icon, type }) => (
    <button
      onClick={() => {
        setFeedType(type)
        router.query.type = type.toLowerCase()
        router.push(router)
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
    </button>
  )

  return (
    <div className="flex gap-3 px-5 mt-3 sm:px-0 sm:mt-0">
      <FeedLink
        name="Top Commented"
        icon={<ChatAlt2Icon className="w-4 h-4" />}
        type="TOP_COMMENTED"
      />
      <FeedLink
        name="Top Collected"
        icon={<CollectionIcon className="w-4 h-4" />}
        type="TOP_COLLECTED"
      />
      <FeedLink
        name="Latest"
        icon={<ClockIcon className="w-4 h-4" />}
        type="LATEST"
      />
    </div>
  )
}

export default FeedType
