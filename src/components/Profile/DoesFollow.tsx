import { DoesFollowResponse } from '@generated/types'
import React, { FC } from 'react'

interface Props {
  followData: DoesFollowResponse
}

const DoesFollow: FC<Props> = ({ followData }) => {
  if (!followData?.follows) return null

  return (
    <div className="py-0.5 px-2 text-xs bg-gray-200 rounded-full">
      Follows you
    </div>
  )
}

export default DoesFollow
