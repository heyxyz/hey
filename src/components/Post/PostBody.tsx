import 'linkify-plugin-mention'

import { LensterPost } from '@generated/lenstertypes'
import { UserAddIcon, UsersIcon } from '@heroicons/react/outline'
import { linkifyOptions } from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import React from 'react'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const PostBody: React.FC<Props> = ({ post }) => {
  const postType = post.metadata?.attributes[0]?.value

  return (
    <div className="flex items-start justify-between linkify">
      <Linkify tagName="div" options={linkifyOptions}>
        {postType === 'community' ? (
          <div className="flex items-center space-x-1.5">
            {post?.collectedBy ? (
              <UserAddIcon className="w-4 h-4 text-brand-500" />
            ) : (
              <UsersIcon className="w-4 h-4 text-brand-500" />
            )}
            {post?.collectedBy ? (
              <span>Joined</span>
            ) : (
              <span>Launched a new community</span>
            )}
            <a className="font-bold" href={`/communities/${post.pubId}`}>
              {post?.metadata?.name}
            </a>
          </div>
        ) : (
          post?.metadata?.content
        )}
      </Linkify>
    </div>
  )
}

export default PostBody
