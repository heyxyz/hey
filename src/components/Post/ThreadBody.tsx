import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'

import PostActions from './Actions'
import PostBody from './PostBody'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const ThreadBody: FC<Props> = ({ post }) => {
  const { pathname } = useRouter()
  const postType = post?.metadata?.attributes[0]?.value
  const [showMore, setShowMore] = useState<boolean>(
    post?.metadata?.content?.length > 450
  )

  return (
    <div>
      <div className="flex justify-between space-x-1.5">
        <UserProfile profile={post?.profile} />
        <Link href={`/posts/${post?.id}`}>
          <a href={`/posts/${post?.id}`} className="text-sm text-gray-500">
            {dayjs(new Date(post?.createdAt)).fromNow()}
          </a>
        </Link>
      </div>
      <div className="flex">
        <div className="ml-5 mr-8 border-[0.8px] bg-gray-300 border-gray-300 -my-[4px]" />
        <div className="pt-4 pb-2">
          <PostBody post={post} />
          <PostActions post={post} />
        </div>
      </div>
    </div>
  )
}

export default ThreadBody
