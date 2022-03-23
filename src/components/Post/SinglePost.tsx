import 'linkify-plugin-mention'

import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { LensterPost } from '@generated/lenstertypes'
import { getURLs } from '@lib/getURLs'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import Collect from './Actions/Collect'
import Comment from './Actions/Comment'
import PostMenu from './Actions/Menu'
import Mirror from './Actions/Mirror'
import PostBody from './PostBody'
import Collected from './Type/Collected'
import Commented from './Type/Commented'
import CommunityPost from './Type/CommunityPost'
import Mirrored from './Type/Mirrored'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
  type?: string
  showCard?: boolean
}

const SinglePost: React.FC<Props> = ({ post, type, showCard = true }) => {
  const { pathname } = useRouter()
  const postType = post.metadata?.attributes[0]?.value

  return (
    <Card className={clsx({ 'border-0': !showCard })}>
      <CardBody>
        {post?.__typename === 'Mirror' && <Mirrored post={post} />}
        {post?.__typename === 'Comment' &&
          type !== 'COMMENT' &&
          postType !== 'community_post' && <Commented post={post} />}
        {postType === 'community_post' && pathname !== '/communities/[id]' && (
          <CommunityPost post={post} />
        )}
        {post?.collectedBy &&
          type !== 'COLLECT' &&
          postType !== 'community' && <Collected post={post} />}
        <div className="flex justify-between pb-4">
          <UserProfile profile={post.profile} />
          <Link href={`/post/${post.pubId}`}>
            <a className="text-sm text-gray-500" href={`/post/${post.pubId}`}>
              {dayjs(new Date(post.createdAt)).fromNow()}
            </a>
          </Link>
        </div>
        <PostBody post={post} />
        {post?.metadata?.media?.length > 0 ? (
          <Attachments attachments={post?.metadata?.media} />
        ) : (
          post?.metadata?.content &&
          getURLs(post?.metadata?.content)?.length > 0 && (
            <IFramely url={getURLs(post?.metadata?.content)[0]} />
          )
        )}
      </CardBody>
      {postType !== 'community' && (
        <div className="flex items-center px-3 py-1.5 text-gray-500 border-t dark:border-gray-800 gap-6">
          <Comment post={post} />
          <Mirror post={post} />
          {post?.collectModule?.__typename !== 'RevertCollectModuleSettings' &&
            post.__typename !== 'Mirror' && <Collect post={post} />}
          <PostMenu post={post} />
        </div>
      )}
    </Card>
  )
}

export default SinglePost
