import { Card, CardBody } from '@components/UI/Card'
import { FC } from 'react'

import UserProfileShimmer from './UserProfileShimmer'

const PostShimmer: FC = () => {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex justify-between">
          <UserProfileShimmer />
          <div className="w-20 h-3 rounded-lg shimmer" />
        </div>
        <div className="space-y-2">
          <div className="w-7/12 h-3 rounded-lg shimmer" />
          <div className="w-1/3 h-3 rounded-lg shimmer" />
        </div>
      </CardBody>
      <div className="flex gap-7 py-3 px-5 border-t dark:border-gray-700/80">
        <div className="w-5 h-5 rounded-lg shimmer" />
        <div className="w-5 h-5 rounded-lg shimmer" />
        <div className="w-5 h-5 rounded-lg shimmer" />
      </div>
    </Card>
  )
}

export default PostShimmer
