import 'linkify-plugin-mention'

import { LensterPost } from '@generated/lenstertypes'
import React, { FC } from 'react'

import Collect from './Collect'
import Comment from './Comment'
import PostMenu from './Menu'
import Mirror from './Mirror'

interface Props {
  post: LensterPost
}

const PostActions: FC<Props> = ({ post }) => {
  const postType = post.metadata?.attributes[0]?.value

  return (
    <>
      {postType !== 'community' && postType !== 'crowdfund' && (
        <div className="flex gap-6 items-center py-1.5 px-3 text-gray-500 border-t dark:border-gray-700/80">
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
