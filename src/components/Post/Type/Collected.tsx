import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
  post: LensterPost
  type: string
}

const Collected: FC<Props> = ({ post, type }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-[13px] text-gray-500">
      <CollectionIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <div>{type} by</div>
        <Link href={`/u/${post?.collectedBy?.defaultProfile?.handle}`}>
          <a href={`/u/${post?.collectedBy?.defaultProfile?.handle}`}>
            <Slug slug={post?.collectedBy?.defaultProfile?.handle} prefix="@" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Collected
