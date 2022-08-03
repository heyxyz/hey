import UserProfile from '@components/Shared/UserProfile'
import { LensterPublication } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import PublicationActions from './Actions'
import HiddenPublication from './HiddenPublication'
import PublicationBody from './PublicationBody'

dayjs.extend(relativeTime)

interface Props {
  publication: LensterPublication
}

const ThreadBody: FC<Props> = ({ publication }) => {
  return (
    <div>
      <div className="flex justify-between space-x-1.5">
        <UserProfile
          profile={
            publication?.collectedBy?.defaultProfile
              ? publication?.collectedBy?.defaultProfile
              : publication?.__typename === 'Mirror'
              ? publication?.mirrorOf?.profile
              : publication?.profile
          }
        />
        <Link href={`/posts/${publication?.id ?? publication?.pubId}`}>
          <a
            href={`/posts/${publication?.id ?? publication?.pubId}`}
            className="text-sm text-gray-500"
          >
            {dayjs(new Date(publication?.createdAt)).fromNow()}
          </a>
        </Link>
      </div>
      <div className="flex">
        <div className="mr-8 ml-5 bg-gray-300 border-gray-300 dark:bg-gray-700 dark:border-gray-700 border-[0.8px] -my-[4px]" />
        <div className="pt-4 pb-5 w-full">
          {publication?.hidden ? (
            <HiddenPublication type={publication?.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <PublicationActions publication={publication} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThreadBody
