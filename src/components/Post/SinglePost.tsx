import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import PostActions from './Actions'
import HiddenPost from './HiddenPost'
import PostBody from './PostBody'
import PostType from './Type'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
  clickable?: boolean
  showType?: boolean
  showThread?: boolean
  showActions?: boolean
}

const SinglePost: FC<Props> = ({
  post,
  clickable = true,
  showType = true,
  showThread = false,
  showActions = true
}) => {
  const postType = post?.metadata?.attributes[0]?.value

  return (
    <Link href={`/posts/${post?.id ?? post?.pubId}`}>
      <div
        className={clsx(
          {
            'cursor-pointer first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100/70 hover:dark:bg-gray-800/70':
              clickable
          },
          'p-5'
        )}
        data-test="publication"
      >
        <PostType post={post} showType={showType} showThread={showThread} />
        <div>
          <div className="flex justify-between pb-4 space-x-1.5">
            <UserProfile
              profile={
                postType === 'community' && !!post?.collectedBy?.defaultProfile
                  ? post?.collectedBy?.defaultProfile
                  : post?.__typename === 'Mirror'
                  ? post?.mirrorOf?.profile
                  : post?.profile
              }
            />
            <span
              className="text-sm text-gray-500"
              data-test="publication-timestamp"
            >
              {dayjs(new Date(post?.createdAt)).fromNow()}
            </span>
          </div>
          <div className="ml-[53px]" data-test="publication-content">
            {post?.hidden ? (
              <HiddenPost type={post?.__typename} />
            ) : (
              <>
                <PostBody post={post} />
                {showActions && <PostActions post={post} />}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SinglePost
