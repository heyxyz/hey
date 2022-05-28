import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import getURLs from '@lib/getURLs'
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
}

const SinglePost: FC<Props> = ({ post, hideType = false }) => {
  const postType = post?.metadata?.attributes[0]?.value

  return (
    <div>
      <PostType post={post} hideType={hideType} />
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
        <Link href={`/posts/${post?.id}`}>
          <a href={`/posts/${post?.id}`} className="text-sm text-gray-500">
            {dayjs(new Date(post?.createdAt)).fromNow()}
          </a>
        </Link>
      </div>
      <div className="ml-14">
        <PostBody post={post} />
        {post?.metadata?.media?.length > 0 ? (
          <Attachments attachments={post?.metadata?.media} />
        ) : (
          post?.metadata?.content &&
          postType !== 'crowdfund' &&
          postType !== 'community' &&
          getURLs(post?.metadata?.content)?.length > 0 && (
            <IFramely url={getURLs(post?.metadata?.content)[0]} />
          )
        )}
        <PostActions post={post} />
      </div>
    </div>
  )
}

export default SinglePost
