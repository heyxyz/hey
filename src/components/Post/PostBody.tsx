import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import Markup from '@components/Shared/Markup'
import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer'
import { LensterPost } from '@generated/lenstertypes'
import { EyeIcon, UserAddIcon, UsersIcon } from '@heroicons/react/outline'
import getURLs from '@lib/getURLs'
import imagekitURL from '@lib/imagekitURL'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

const Crowdfund = dynamic(() => import('./Crowdfund'), {
  loading: () => <CrowdfundShimmer />
})

interface Props {
  post: LensterPost
}

const PostBody: FC<Props> = ({ post }) => {
  const { pathname } = useRouter()
  const postType = post?.metadata?.attributes[0]?.value
  const showMore =
    post?.metadata?.content?.length > 450 && pathname !== '/posts/[id]'

  return (
    <div className="break-words">
      {postType === 'community' ? (
        <div className="block items-center space-y-2 space-x-0 sm:flex sm:space-y-0 sm:space-x-2 linkify">
          <span className="flex items-center space-x-1.5">
            {post?.collectedBy ? (
              <UserAddIcon className="w-4 h-4 text-brand" />
            ) : (
              <UsersIcon className="w-4 h-4 text-brand" />
            )}
            {post?.collectedBy ? (
              <span>Joined</span>
            ) : (
              <span>Launched a new community</span>
            )}
          </span>
          <Link href={`/communities/${post?.id}`}>
            <a
              href={`/communities/${post?.id}`}
              className="flex items-center space-x-1.5 font-bold"
            >
              <img
                src={imagekitURL(
                  post?.metadata?.cover?.original?.url
                    ? post?.metadata?.cover?.original?.url
                    : `https://avatar.tobi.sh/${post?.id}.png`,
                  'avatar'
                )}
                className="bg-gray-200 rounded ring-2 ring-gray-50 dark:bg-gray-700 dark:ring-black w-[19px] h-[19px]"
                height={19}
                width={19}
                alt={post?.id}
              />
              <div>{post?.metadata?.name}</div>
            </a>
          </Link>
        </div>
      ) : postType === 'crowdfund' ? (
        <Crowdfund fund={post} />
      ) : (
        <>
          <div
            className={clsx({
              'line-clamp-5': showMore
            })}
          >
            <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
              <Markup>{post?.metadata?.content}</Markup>
            </div>
          </div>
          {showMore && (
            <div className="mt-4 text-sm text-gray-500 font-bold flex items-center space-x-1">
              <EyeIcon className="h-4 w-4" />
              <span>Show more</span>
            </div>
          )}
        </>
      )}
      {post?.metadata?.media?.length > 0 ? (
        <Attachments attachments={post?.metadata?.media} />
      ) : (
        post?.metadata?.content &&
        postType !== 'crowdfund' &&
        postType !== 'community' &&
        getURLs(post?.metadata?.content)?.length > 0 && (
          <IFramely url={getURLs(post?.metadata?.content)[0]} />
        )
      )}
    </div>
  )
}

export default PostBody
