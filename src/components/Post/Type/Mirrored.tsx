import Slug from '@components/Shared/Slug'
import { Mirror } from '@generated/types'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
  post: Mirror
}

const Mirrored: FC<Props> = ({ post }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-sm text-gray-500">
      <SwitchHorizontalIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <Link href={`/u/${post?.profile?.handle}`}>
          <a>
            {post?.profile?.name ? (
              <b>{post?.profile?.name}</b>
            ) : (
              <Slug slug={post?.profile?.handle} prefix="@" />
            )}
          </a>
        </Link>
        <Link href={`/posts/${post?.mirrorOf?.id}`}>
          <a>
            <span>mirrored the </span>
            <b>{post.mirrorOf.__typename?.toLowerCase()}</b>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Mirrored
