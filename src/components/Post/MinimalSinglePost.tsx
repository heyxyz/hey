import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import PostType from './MinimalType'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
  hideType?: boolean
}

const MinimalSinglePost: FC<Props> = ({ post, hideType = false }) => {
  const postType = post?.metadata?.attributes[0]?.value

  return (
    <div className="flex gap-3 justify-between">
      <Link href={`/posts/${post?.id}`}>
        <a href={`/posts/${post?.id}`} className="text-xs text-gray-500">
          {dayjs(new Date(post?.createdAt)).fromNow()}
        </a>
      </Link>
      <UserProfile
        profile={
          post?.__typename === 'Mirror'
            ? post?.mirrorOf?.profile
            : post?.profile
        }
      />
      <PostType post={post} />
    </div>
  )
}

export default MinimalSinglePost
