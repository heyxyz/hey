import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
import { Profile } from '@generated/types'
import { getAvatar } from '@lib/getAvatar'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

interface Props {
  post: LensterPost
}

const Commented: React.FC<Props> = ({ post }) => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="flex items-end">
      <img
        src={`${STATIC_ASSETS}/icons/${
          resolvedTheme === 'dark' ? 'comment-dark' : 'comment-light'
        }.svg`}
        className="mr-2 mb-0.5 ml-5 w-4"
        alt="Comment"
      />
      <div className="flex items-center text-sm space-x-1 text-gray-500 pb-3">
        <Link href={`/u/${post?.commentOn?.profile?.handle}`}>
          <a className="font-bold flex items-center space-x-2">
            <img
              className="h-6 w-6 rounded-full"
              src={getAvatar(post?.commentOn?.profile as Profile)}
              alt={post?.commentOn?.profile?.handle}
            />
            <Slug slug={post?.commentOn?.profile?.handle} prefix="@" />:
          </a>
        </Link>
        <Link href={`/posts/${post?.commentOn?.id}`}>
          <a className="line-clamp-1 w-2/4">
            {post?.commentOn?.metadata?.content}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Commented
