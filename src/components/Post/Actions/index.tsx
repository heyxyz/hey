import 'linkify-plugin-mention'

import { LensterPost } from '@generated/lenstertypes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'

import Collect from './Collect'
import Comment from './Comment'
import PostMenu from './Menu'
import Mirror from './Mirror'

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const PostActions: React.FC<Props> = ({ post }) => {
  const postType = post.metadata?.attributes[0]?.value

  return (
    <>
      {postType !== 'community' && postType !== 'crowdfund' && (
        <div className="flex items-center px-3 py-1.5 text-gray-500 border-t dark:border-gray-800 gap-6">
          <Comment post={post} />
          <Mirror post={post} />
          {post?.collectModule?.__typename !== 'RevertCollectModuleSettings' &&
            post.__typename !== 'Mirror' && <Collect post={post} />}
          <PostMenu post={post} />
        </div>
      )}
    </>
  )
}

export default PostActions
