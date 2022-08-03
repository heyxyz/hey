import Slug from '@components/Shared/Slug'
import { LensterPublication } from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import formatAddress from '@lib/formatAddress'
import Link from 'next/link'
import React, { FC } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

interface Props {
  post: LensterPublication
  type: string
}

const Collected: FC<Props> = ({ post, type }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <CollectionIcon className="w-4 h-4" />
      <div className="flex items-center space-x-1">
        <div>{type} by</div>
        {post?.collectedBy?.defaultProfile ? (
          <Link href={`/u/${post?.collectedBy?.defaultProfile?.handle}`}>
            <a href={`/u/${post?.collectedBy?.defaultProfile?.handle}`}>
              <Slug
                slug={post?.collectedBy?.defaultProfile?.handle}
                prefix="@"
              />
            </a>
          </Link>
        ) : (
          <a
            href={`${POLYGONSCAN_URL}/address/${post?.collectedBy?.address}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Slug slug={formatAddress(post?.collectedBy?.address)} />
          </a>
        )}
      </div>
    </div>
  )
}

export default Collected
