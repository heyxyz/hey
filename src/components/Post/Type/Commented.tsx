import Markup from '@components/Shared/Markup'
import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const PostBody: FC<Props> = ({ post }) => (
  <div className="flex justify-between">
    <div>
      <UserProfile profile={post?.profile} />
      <div className="flex">
        <div className="ml-5 mr-8 border-[0.8px] bg-gray-300 border-gray-300 -my-[4px]" />
        {post?.metadata?.content?.trim() ? (
          <div className="linkify pt-5 pb-6">
            <Markup>{post?.metadata?.content}</Markup>
          </div>
        ) : (
          post?.metadata?.name
        )}
      </div>
    </div>
    <Link href={`/posts/${post?.id}`}>
      <a href={`/posts/${post?.id}`} className="text-sm text-gray-500">
        {dayjs(new Date(post?.createdAt)).fromNow()}
      </a>
    </Link>
  </div>
)

const Commented: FC<Props> = ({ post }) => {
  const commentOn: LensterPost | any = post?.commentOn
  const mainPost = commentOn?.mainPost
  const postType = mainPost?.metadata?.attributes[0]?.value

  return (
    <div>
      {mainPost && postType !== 'community' ? (
        <PostBody post={mainPost} />
      ) : null}
      <PostBody post={commentOn} />
    </div>
  )
}

export default Commented
