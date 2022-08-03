import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer'
import React, { FC } from 'react'

const CommunityPageShimmer: FC = () => {
  return (
    <GridLayout>
      <GridItemFour>
        <div className="px-5 mb-4 space-y-5 sm:px-0">
          <div className="relative w-32 h-32 sm:w-72 sm:h-72">
            <div className="w-32 h-32 bg-gray-200 rounded-xl ring-8 ring-gray-50 sm:w-72 sm:h-72 dark:bg-gray-700 dark:ring-black shimmer" />
          </div>
          <div className="pt-3 space-y-1">
            <div className="flex gap-1.5 items-center text-2xl font-bold truncate">
              <div className="w-1/3 h-5 rounded-lg shimmer" />
            </div>
          </div>
          <div className="pt-2 space-y-5">
            <div className="space-y-2">
              <div className="w-7/12 h-3 rounded-lg shimmer" />
              <div className="w-1/3 h-3 rounded-lg shimmer" />
            </div>
            <div className="w-28 rounded-lg h-[34px] shimmer" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-lg shimmer" />
                <div className="w-20 h-3 rounded-lg shimmer" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-lg shimmer" />
                <div className="w-20 h-3 rounded-lg shimmer" />
              </div>
            </div>
          </div>
        </div>
      </GridItemFour>
      <GridItemEight>
        <PublicationsShimmer />
      </GridItemEight>
    </GridLayout>
  )
}

export default CommunityPageShimmer
