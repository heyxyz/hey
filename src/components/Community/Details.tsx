import 'linkify-plugin-mention'

import { LensterPost } from '@generated/lenstertypes'
import { HashtagIcon } from '@heroicons/react/outline'
import { linkifyOptions } from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import React from 'react'

dayjs.extend(relativeTime)

interface Props {
  community: LensterPost
}

const Details: React.FC<Props> = ({ community }) => {
  const MetaDetails = ({
    children,
    icon
  }: {
    children: React.ReactChild
    icon: React.ReactChild
  }) => (
    <div className="flex items-center gap-2">
      {icon}
      <div>{children}</div>
    </div>
  )

  return (
    <div className="px-5 mb-4 sm:px-0">
      <div className="space-y-5">
        <div className="relative w-32 h-32 sm:h-72 sm:w-72">
          <img
            src={community?.metadata?.cover?.original?.url}
            className="w-32 h-32 bg-gray-200 rounded-xl ring-8 sm:h-72 sm:w-72 dark:bg-gray-700 ring-gray-50 dark:ring-black"
            alt="Avatar"
          />
        </div>
        <div className="pt-3 space-y-1">
          <div className="flex items-center gap-1.5 text-2xl font-bold truncate">
            <div className="truncate">{community?.metadata.name}</div>
          </div>
        </div>
        <div className="space-y-5">
          {community?.metadata.description && (
            <div className="mr-0 leading-7 sm:mr-10 linkify">
              <Linkify tagName="div" options={linkifyOptions}>
                {community?.metadata.description}
              </Linkify>
            </div>
          )}
          <div className="space-y-2">
            <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
              {community?.pubId}
            </MetaDetails>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
