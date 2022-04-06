import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
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
    <div className="flex items-end w-3/5">
      <img
        src={`${STATIC_ASSETS}/icons/${
          resolvedTheme === 'dark' ? 'comment-dark' : 'comment-light'
        }.svg`}
        className="mr-1.5 ml-5 w-4"
        alt="Comment"
      />
      <div className="flex items-center pb-3.5 space-x-1 text-sm text-gray-500">
        <Link href={`/u/${post?.commentOn?.profile?.handle}`}>
          <a>
            <Slug slug={post?.commentOn?.profile?.handle} prefix="@" />:
          </a>
        </Link>
        <Link href={`/posts/${post?.commentOn?.id}`}>
          <a className="line-clamp-1">
            {post?.commentOn?.metadata?.content.trim()
              ? post?.commentOn?.metadata?.content
              : post?.commentOn?.metadata?.name}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Commented
