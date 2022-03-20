import Slug from '@components/Shared/Slug'
import { LensHubPost } from '@generated/lenshubtypes'
import { DuplicateIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

interface Props {
  post: LensHubPost
}

const Mirrored: React.FC<Props> = ({ post }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-sm text-gray-500">
      <DuplicateIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <div>Mirror of</div>
        {/* @ts-ignore */}
        <Link href={`/post/${post?.mirrorOf?.id}`}>
          <a className="font-bold">post</a>
        </Link>
        <div>by</div>
        {/* @ts-ignore */}
        <Link href={`/u/${post?.mirrorOf?.profile?.handle}`}>
          <a>
            {/* @ts-ignore */}
            <Slug slug={post?.mirrorOf?.profile?.handle} prefix="@" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Mirrored
