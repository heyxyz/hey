import { FC } from 'react'

const CommunityShimmer: FC = () => {
  return (
    <div className="flex items-center space-x-3 grow">
      <div className="w-16 h-16 bg-gray-200 rounded-xl border shimmer dark:border-gray-700/80"></div>
      <div className="space-y-1 grow">
        <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
      </div>
    </div>
  )
}

export default CommunityShimmer
