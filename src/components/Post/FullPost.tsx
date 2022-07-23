import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC } from 'react'

import PostActions from './Actions'
import HiddenPost from './HiddenPost'
import PostBody from './PostBody'
import PostType from './Type'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const FullPost: FC<Props> = ({ post }) => {
  const postType = post?.metadata?.attributes[0]?.value

  return (
    <article className="p-5" data-test="publication">
      <PostType post={post} showType />
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
              <PostActions post={post} />
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default FullPost
