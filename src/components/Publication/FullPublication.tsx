import UserProfile from '@components/Shared/UserProfile'
import { LensterPublication } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC } from 'react'

import PublicationActions from './Actions'
import HiddenPublication from './HiddenPublication'
import PublicationBody from './PublicationBody'
import PublicationType from './Type'

dayjs.extend(relativeTime)

interface Props {
  publication: LensterPublication
}

const FullPublication: FC<Props> = ({ publication }) => {
  const publicationType = publication?.metadata?.attributes[0]?.value

  return (
    <article className="p-5">
      <PublicationType publication={publication} showType />
      <div>
        <div className="flex justify-between pb-4 space-x-1.5">
          <UserProfile
            profile={
              publicationType === 'community' &&
              !!publication?.collectedBy?.defaultProfile
                ? publication?.collectedBy?.defaultProfile
                : publication?.__typename === 'Mirror'
                ? publication?.mirrorOf?.profile
                : publication?.profile
            }
          />
          <span className="text-sm text-gray-500">
            {dayjs(new Date(publication?.createdAt)).fromNow()}
          </span>
        </div>
        <div className="ml-[53px]">
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
    </article>
  )
}

export default FullPublication
