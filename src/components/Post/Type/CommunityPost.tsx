import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
import { UsersIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

interface Props {
  post: LensterPost
}

const CommunityPost: React.FC<Props> = ({ post }) => {
  const commentOn: any = post?.commentOn

  return (
    <div className="flex items-center pb-4 space-x-1 text-sm text-gray-500">
      <UsersIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <Link href={`/communities/${commentOn?.pubId}`}>
          <a>
            <span>Posted on </span>
            <Slug slug={post?.commentOn?.metadata?.name} />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default CommunityPost
