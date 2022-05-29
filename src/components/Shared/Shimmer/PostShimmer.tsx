import { FC } from 'react'

import UserProfileShimmer from './UserProfileShimmer'

const PostShimmer: FC = () => {
  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-between">
        <UserProfileShimmer />
        <div className="w-20 h-3 rounded-lg shimmer" />
      </div>
      <div className="ml-[52px] space-y-4">
        <div className="space-y-2">
          <div className="w-7/12 h-3 rounded-lg shimmer" />
          <div className="w-1/3 h-3 rounded-lg shimmer" />
        </div>
        <div className="flex gap-7 pt-3">
          <div className="w-5 h-5 rounded-lg shimmer" />
          <div className="w-5 h-5 rounded-lg shimmer" />
          <div className="w-5 h-5 rounded-lg shimmer" />
        </div>
      </div>
    </div>
  )
}

export default PostShimmer
