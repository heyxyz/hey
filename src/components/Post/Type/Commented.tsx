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
      <div className="flex items-center pb-3 space-x-1 text-sm text-gray-500">
        <Link href={`/u/${post?.commentOn?.profile?.handle}`}>
          <a className="flex items-center space-x-2 font-bold">
            <img
              className="w-6 h-6 rounded-full"
              src={getAvatar(post?.commentOn?.profile as Profile)}
              alt={post?.commentOn?.profile?.handle}
            />
            <Slug slug={post?.commentOn?.profile?.handle} prefix="@" />:
          </a>
        </Link>
        <Link href={`/posts/${post?.commentOn?.id}`}>
          <a className="md:w-2/4 line-clamp-1">
            {post?.commentOn?.metadata?.content}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Commented
