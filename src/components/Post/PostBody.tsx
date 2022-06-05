import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import Markup from '@components/Shared/Markup'
import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer'
import { LensterPost } from '@generated/lenstertypes'
import { UserAddIcon, UsersIcon } from '@heroicons/react/outline'
import getURLs from '@lib/getURLs'
import imagekitURL from '@lib/imagekitURL'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'

const Crowdfund = dynamic(() => import('./Crowdfund'), {
  loading: () => <CrowdfundShimmer />
})

interface Props {
  post: LensterPost
}

const PostBody: FC<Props> = ({ post }) => {
  const { pathname } = useRouter()
  const postType = post?.metadata?.attributes[0]?.value
  const [showMore, setShowMore] = useState<boolean>(
    post?.metadata?.content?.length > 450
  )

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
          <Link href={`/communities/${post?.id}`} prefetch={false}>
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
              'line-clamp-5 text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-400 dark:to-gray-900':
                showMore && pathname !== '/posts/[id]'
            })}
          >
            <div className="leading-6 sm:leading-7 whitespace-pre-wrap break-words linkify text-sm sm:text-base">
              <Markup>{post?.metadata?.content}</Markup>
            </div>
          </div>
          {showMore && pathname !== '/posts/[id]' && (
            <button
              type="button"
              className="mt-2 text-sm font-bold"
              onClick={() => setShowMore(!showMore)}
            >
              Show more
            </button>
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
