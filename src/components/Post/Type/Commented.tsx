import Markup from '@components/Shared/Markup'
import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
  post: LensterPost
}

const PostBody: FC<Props> = ({ post }) => (
  <div>
    <Link href={`/u/${post?.profile?.handle}`}>
      <div className="h-10 w-10">
        <UserProfile profile={post?.profile} />
      </div>
    </Link>
    <div className="flex">
      <div className="ml-5 mr-8 border-[0.8px] bg-gray-300 border-gray-300 -mb-[4px] mt-[4px]" />
      <Link href={`/posts/${post?.id ?? post?.pubId}`}>
        <a href={`/posts/${post?.id ?? post?.pubId}`}>
          {post?.metadata?.content?.trim() ? (
            <div className="linkify pt-5 pb-6">
              <Markup>{post?.metadata?.content}</Markup>
            </div>
          ) : (
            post?.metadata?.name
          )}
        </a>
      </Link>
    </div>
  </div>
)

const Commented: FC<Props> = ({ post }) => {
  const commentOn: LensterPost | any = post?.commentOn
  const mainPost = commentOn?.mainPost

  return (
    <div>
      {mainPost ? <PostBody post={mainPost} /> : null}
      <PostBody post={commentOn} />
    </div>
  )
}

export default Commented
