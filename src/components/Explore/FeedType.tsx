import {
  ChatAlt2Icon,
  ClockIcon,
  CollectionIcon,
  SwitchHorizontalIcon
} from '@heroicons/react/outline'
import { Mixpanel } from '@lib/mixpanel'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { Dispatch, FC, ReactNode } from 'react'

interface Props {
  setFeedType: Dispatch<string>
  feedType: string
}

const FeedType: FC<Props> = ({ setFeedType, feedType }) => {
  const { push } = useRouter()

  interface FeedLinkProps {
    name: string
    icon: ReactNode
    type: string
    testId: string
  }

  const FeedLink: FC<FeedLinkProps> = ({ name, icon, type, testId }) => (
    <button
      type="button"
      onClick={() => {
        push({ query: { type: type.toLowerCase() } })
        setFeedType(type)
        Mixpanel.track(`explore.${type.toLowerCase()}.tab_switch`)
      }}
      className={clsx(
        {
          'text-brand bg-brand-100 dark:bg-opacity-20 bg-opacity-100 font-bold':
            feedType === type
        },
        'flex items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand hover:bg-brand-100 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
      aria-label={name}
      data-test={testId}
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
        testId="type-top-commented"
      />
      <FeedLink
        name="Top Collected"
        icon={<CollectionIcon className="w-4 h-4" />}
        type="TOP_COLLECTED"
        testId="type-top-collected"
      />
      <FeedLink
        name="Top Mirrored"
        icon={<SwitchHorizontalIcon className="w-4 h-4" />}
        type="TOP_MIRRORED"
        testId="type-top-mirrored"
      />
      <FeedLink
        name="Latest"
        icon={<ClockIcon className="w-4 h-4" />}
        type="LATEST"
        testId="type-latest"
      />
    </div>
  )
}

export default FeedType
