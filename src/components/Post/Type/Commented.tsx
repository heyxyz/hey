import Markup from '@components/Shared/Markup'
import Slug from '@components/Shared/Slug'
import { LensterPost } from '@generated/lenstertypes'
import getAvatar from '@lib/getAvatar'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { FC } from 'react'
import { STATIC_ASSETS } from 'src/constants'

interface Props {
  post: LensterPost
}

const PostBody: FC<Props> = ({ post }) => (
  <div className="flex items-center pb-3.5 space-x-1 text-gray-500 text-[13px]">
    <Link href={`/u/${post?.profile?.handle}`}>
      <a
        className="flex items-center space-x-1"
        href={`/u/${post?.profile?.handle}`}
      >
        <div className="h-4 w-4">
          <img
            className="rounded-full border dark:border-gray-700/80"
            height={16}
            width={16}
            src={getAvatar(post?.profile)}
            alt="Avatar"
          />
        </div>
        <Slug slug={post?.profile?.handle} prefix="@" />:
      </a>
    </Link>
    <Link href={`/posts/${post?.id ?? post?.pubId}`}>
      <a
        href={`/posts/${post?.id ?? post?.pubId}`}
        className="break-all line-clamp-1"
      >
        {post?.metadata?.content?.trim() ? (
          <div className="linkify">
            <Markup>{post?.metadata?.content}</Markup>
          </div>
        ) : (
          post?.metadata?.name
        )}
      </a>
    </Link>
  </div>
)

const Commented: FC<Props> = ({ post }) => {
  const { resolvedTheme } = useTheme()
  const commentOn: LensterPost | any = post?.commentOn
  const mainPost = commentOn?.mainPost

  return (
    <>
      {mainPost ? (
        <div className="flex items-end w-3/5">
          <img
            draggable={false}
            src={`${STATIC_ASSETS}/icons/${
              resolvedTheme === 'dark' ? 'mainpost-dark' : 'mainpost-light'
            }.svg`}
            className="mr-1.5 ml-5 w-4 -mb-[14px]"
            width={16}
            alt="Comment"
          />
          <PostBody post={mainPost} />
        </div>
      ) : null}
      <div className="flex items-end w-3/5">
        <img
          draggable={false}
          src={`${STATIC_ASSETS}/icons/${
            resolvedTheme === 'dark' ? 'comment-dark' : 'comment-light'
          }.svg`}
          className="mr-1.5 ml-5 w-4"
          width={16}
          alt="Comment"
        />
        <PostBody post={commentOn} />
      </div>
    </>
  )
}

export default Commented
