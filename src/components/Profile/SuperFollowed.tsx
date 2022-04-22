import { HeartIcon } from '@heroicons/react/solid'
import React, { FC } from 'react'

interface Props {
  times: number
  following?: boolean
}

const SuperFollowed: FC<Props> = ({ times, following = false }) => {
  return (
    <div className="flex items-center gap-1.5 text-pink-500 text-[13px]">
      <HeartIcon className="h-4 w-4" />
      <div>
        Super {following ? 'following' : 'followed'}{' '}
        {times ? `${times} ${times > 1 ? 'times' : 'time'}` : ''}
      </div>
    </div>
  )
}

export default SuperFollowed
