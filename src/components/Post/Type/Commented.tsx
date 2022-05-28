import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import Markup from '@components/Shared/Markup'
import UserProfile from '@components/Shared/UserProfile'
import { LensterPost } from '@generated/lenstertypes'
import getURLs from '@lib/getURLs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import PostActions from '../Actions'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const ThreadBody: FC<Props> = ({ post }) => {
  const postType = post?.metadata?.attributes[0]?.value

  return (
    <div className="flex justify-between">
      <div>
        <UserProfile profile={post?.profile} />
        <div className="flex">
          <div className="ml-5 mr-8 border-[0.8px] bg-gray-300 border-gray-300 -my-[4px]" />
          <div>
            {post?.metadata?.content?.trim() ? (
              <div className="linkify pt-5">
                <Markup>{post?.metadata?.content}</Markup>
              </div>
            ) : (
              post?.metadata?.name
            )}
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
      </div>
      <Link href={`/posts/${post?.id}`}>
        <a href={`/posts/${post?.id}`} className="text-sm text-gray-500">
          {dayjs(new Date(post?.createdAt)).fromNow()}
        </a>
      </Link>
    </div>
  )
}

const Commented: FC<Props> = ({ post }) => {
  const commentOn: LensterPost | any = post?.commentOn
  const mainPost = commentOn?.mainPost
  const postType = mainPost?.metadata?.attributes[0]?.value

  return (
    <div>
      {mainPost && postType !== 'community' ? (
        <ThreadBody post={mainPost} />
      ) : null}
      <ThreadBody post={commentOn} />
    </div>
  )
}

export default Commented
