import 'linkify-plugin-mention'

import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer'
import { LensterPost } from '@generated/lenstertypes'
import { UserAddIcon, UsersIcon } from '@heroicons/react/outline'
import { linkifyOptions } from '@lib/linkifyOptions'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const Crowdfund = dynamic(() => import('./Crowdfund'), {
  loading: () => <CrowdfundShimmer />
})

dayjs.extend(relativeTime)

interface Props {
  post: LensterPost
}

const PostBody: React.FC<Props> = ({ post }) => {
  const { pathname } = useRouter()
  const postType = post.metadata?.attributes[0]?.value
  const [showMore, setShowMore] = useState<boolean>(
    post?.metadata?.content?.length > 450
  )

  return (
    <div className="linkify">
      <Linkify tagName="div" options={linkifyOptions}>
        {postType === 'community' ? (
          <div className="flex items-center space-x-1.5">
            {post?.collectedBy ? (
              <UserAddIcon className="w-4 h-4 text-brand-500" />
            ) : (
              <UsersIcon className="w-4 h-4 text-brand-500" />
            )}
            {post?.collectedBy ? (
              <span>Joined</span>
            ) : (
              <span>Launched a new community</span>
            )}
            <a className="font-bold" href={`/communities/${post.pubId}`}>
              {post?.metadata?.name}
            </a>
          </div>
        ) : postType === 'crowdfund' ? (
          <Crowdfund fund={post} />
        ) : (
          <div>
            <div
              className={clsx({
                'line-clamp-5 text-transparent bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-400 dark:to-gray-900':
                  showMore && pathname !== '/posts/[id]'
              })}
            >
              {post?.metadata?.content}
            </div>
            {showMore && pathname !== '/posts/[id]' && (
              <button
                className="mt-2 text-sm font-bold"
                onClick={() => setShowMore(!showMore)}
              >
                Show more
              </button>
            )}
          </div>
        )}
      </Linkify>
    </div>
  )
}

export default PostBody
