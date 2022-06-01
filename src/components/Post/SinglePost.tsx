import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import PostActions from './Actions'
import PostBody from './PostBody'
import PostType from './Type'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
  hideType?: boolean
  showThread?: boolean
}

const SinglePost: FC<Props> = ({
  post,
  hideType = false,
  showThread = false
}) => {
  const postType = post?.metadata?.attributes[0]?.value

  return (
    <div className="p-5">
      <PostType post={post} hideType={hideType} showThread={showThread} />
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
          <Link href={`/posts/${post?.id}`} prefetch={false}>
            <a href={`/posts/${post?.id}`} className="text-sm text-gray-500">
              {dayjs(new Date(post?.createdAt)).fromNow()}
            </a>
          </Link>
        </div>
        <div className="ml-[53px]">
          <PostBody post={post} />
          <PostActions post={post} />
        </div>
      </div>
    </div>
  )
}

export default SinglePost
