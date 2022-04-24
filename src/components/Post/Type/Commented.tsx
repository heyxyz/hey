import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { FC } from 'react'
import { STATIC_ASSETS } from 'src/constants'

interface Props {
  post: LensterPost
}

const Commented: FC<Props> = ({ post }) => {
  const { resolvedTheme } = useTheme()
  const commentOn: LensterPost | any = post?.commentOn

  return (
    <div className="flex items-end w-3/5">
      <img
        src={`${STATIC_ASSETS}/icons/${
          resolvedTheme === 'dark' ? 'comment-dark' : 'comment-light'
        }.svg`}
        className="mr-1.5 ml-5 w-4"
        alt="Comment"
      />
      <div className="flex items-center pb-3.5 space-x-1 text-gray-500 text-[13px]">
        <Link href={`/u/${commentOn?.profile?.handle}`}>
          <a href={`/u/${commentOn?.profile?.handle}`}>
            <Slug slug={commentOn?.profile?.handle} prefix="@" />:
          </a>
        </Link>
        <Link href={`/posts/${commentOn?.id ?? commentOn?.pubId}`}>
          <a
            href={`/posts/${commentOn?.id ?? commentOn?.pubId}`}
            className="line-clamp-1"
          >
            {commentOn?.metadata?.content?.trim()
              ? commentOn?.metadata?.content
              : commentOn?.metadata?.name}
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Commented
