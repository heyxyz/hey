import { LensterPublication } from '@generated/lenstertypes'
import React, { FC, MouseEvent } from 'react'

import Collect from './Collect'
import Comment from './Comment'
import Like from './Like'
import PostMenu from './Menu'
import Mirror from './Mirror'

interface Props {
  post: LensterPublication
}

const PostActions: FC<Props> = ({ post }) => {
  const postType = post?.metadata?.attributes[0]?.value

  return postType !== 'community' ? (
    <div
      className="flex gap-6 items-center pt-3 -ml-2 text-gray-500 sm:gap-8"
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    >
      <Comment post={post} />
      <Mirror post={post} />
      <Like post={post} />
      {post?.collectModule?.__typename !== 'RevertCollectModuleSettings' &&
        postType !== 'crowdfund' && <Collect post={post} />}
      <PostMenu post={post} />
    </div>
  ) : null
}

export default PostActions
