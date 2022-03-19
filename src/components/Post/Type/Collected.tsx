import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

interface Props {
  post: LensterPost
}

const Collected: React.FC<Props> = ({ post }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-sm text-gray-500">
      <CollectionIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <div>Collected by</div>
        {/* @ts-ignore */}
        <Link href={`/u/${post?.collectedBy?.defaultProfile?.handle}`}>
          <a>
            {/* @ts-ignore */}
            <Slug slug={post?.collectedBy?.defaultProfile?.handle} prefix="@" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Collected
