import { FC } from 'react'

import PostShimmer from './PostShimmer'

const PostsShimmer: FC = () => {
  return (
    <div className="space-y-3">
      <PostShimmer />
      <PostShimmer />
      <PostShimmer />
    </div>
  )
}

export default PostsShimmer
