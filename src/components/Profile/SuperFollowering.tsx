import { HeartIcon } from '@heroicons/react/solid'
import React, { FC } from 'react'

interface Props {
  times: number
  following?: boolean
}

const SuperFollowering: FC<Props> = ({ times, following = false }) => {
  return (
    <div className="flex gap-1.5 items-center text-pink-500 text-[13px]">
      <HeartIcon className="w-4 h-4" />
      <div>
        Super {following ? 'following' : 'followed'}{' '}
        {times ? `${times} ${times > 1 ? 'times' : 'time'}` : ''}
      </div>
    </div>
  )
}

export default SuperFollowering
