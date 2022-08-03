import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import PostActions from './Actions'
import HiddenPost from './HiddenPost'
import PublicationBody from './PublicationBody'
import PostType from './Type'

dayjs.extend(relativeTime)

interface Props {
  publication: LensterPost
  showType?: boolean
  showActions?: boolean
}

const SinglePublication: FC<Props> = ({
  publication,
  showType = true,
  showActions = true
}) => {
  const postType = publication?.metadata?.attributes[0]?.value

  return (
    <Link href={`/posts/${publication?.id ?? publication?.pubId}`} passHref>
      <article
        className="cursor-pointer first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100/70 hover:dark:bg-gray-800/70 p-5"
        data-test="publication"
      >
        <PostType post={publication} showType={showType} showThread />
        <div>
          <div className="flex justify-between pb-4 space-x-1.5">
            <UserProfile
              profile={
                postType === 'community' &&
                !!publication?.collectedBy?.defaultProfile
                  ? publication?.collectedBy?.defaultProfile
                  : publication?.__typename === 'Mirror'
                  ? publication?.mirrorOf?.profile
                  : publication?.profile
              }
            />
            <span
              className="text-sm text-gray-500"
              data-test="publication-timestamp"
            >
              {dayjs(new Date(publication?.createdAt)).fromNow()}
            </span>
          </div>
          <div className="ml-[53px]" data-test="publication-content">
            {publication?.hidden ? (
              <HiddenPost type={publication?.__typename} />
            ) : (
              <>
                <PublicationBody publication={publication} />
                {showActions && <PostActions post={publication} />}
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default SinglePublication
