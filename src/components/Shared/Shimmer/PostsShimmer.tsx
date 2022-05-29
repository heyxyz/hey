import { Card } from '@components/UI/Card'
import { FC } from 'react'

import PostShimmer from './PostShimmer'

const PostsShimmer: FC = () => {
  return (
    <Card className="divide-y-[1px]">
      <PostShimmer />
      <PostShimmer />
      <PostShimmer />
    </Card>
  )
}

export default PostsShimmer
