import { DoesFollowResponse } from '@generated/types'
import { HeartIcon } from '@heroicons/react/solid'
import React, { FC } from 'react'

interface Props {
  followData: DoesFollowResponse
}

const SuperFollowed: FC<Props> = ({ followData }) => {
  if (!followData?.follows) return null

  return (
    <div className="flex items-center gap-1.5 text-pink-500 font-bold text-sm">
      <HeartIcon className="h-4 w-4" />
      <div>Super followed</div>
    </div>
  )
}

export default SuperFollowed
