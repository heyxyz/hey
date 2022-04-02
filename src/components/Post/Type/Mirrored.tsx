import Slug from '@components/Shared/Slug'
import { Mirror } from '@generated/types'
import { DuplicateIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

interface Props {
  post: Mirror
}

const Mirrored: React.FC<Props> = ({ post }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-sm text-gray-500">
      <DuplicateIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <div>Mirror of</div>
        <Link href={`/posts/${post?.mirrorOf?.id}`}>
          <a className="font-bold">{post.mirrorOf.__typename?.toLowerCase()}</a>
        </Link>
        <div>by</div>
        <Link href={`/u/${post?.mirrorOf?.profile?.handle}`}>
          <a>
            <Slug slug={post?.mirrorOf?.profile?.handle} prefix="@" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Mirrored
