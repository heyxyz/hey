import { Card } from '@components/UI/Card'
import { FC } from 'react'

import PostShimmer from './PostShimmer'

const PostsShimmer: FC = () => {
  return (
    <Card className="divide-y-[1px] dark:divide-gray-700/80">
      <PostShimmer />
      <PostShimmer />
      <PostShimmer />
    </Card>
  )
}

export default PostsShimmer
