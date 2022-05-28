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
  const postType = post?.metadata?.attributes[0]?.value

  return postType !== 'community' ? (
    <div className="flex gap-8 items-center pt-3 text-gray-500 -ml-2">
      <Comment post={post} />
      <Mirror post={post} />
      {post?.collectModule?.__typename !== 'RevertCollectModuleSettings' &&
        postType !== 'crowdfund' && <Collect post={post} />}
      <PostMenu post={post} />
    </div>
  ) : null
}

export default PostActions
