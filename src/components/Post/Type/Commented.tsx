import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

interface Props {
  post: LensterPost
}

const Commented: React.FC<Props> = ({ post }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-sm text-gray-500">
      <ChatAlt2Icon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        {/* @ts-ignore */}
        <Link href={`/post/${post?.commentOn?.id}`}>
          <a>Commenting to</a>
        </Link>
        {/* @ts-ignore */}
        <Link href={`/u/${post?.commentOn?.profile?.handle}`}>
          <a>
            {/* @ts-ignore */}
            <Slug slug={post?.commentOn?.profile?.handle} prefix="@" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Commented
