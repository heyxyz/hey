import Attachments from '@components/Shared/Attachments'
import IFramely from '@components/Shared/IFramely'
import Markup from '@components/Shared/Markup'
import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer'
import { LensterPublication } from '@generated/lenstertypes'
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
  publication: LensterPublication
}

const PublicationBody: FC<Props> = ({ publication }) => {
  const { pathname } = useRouter()
  const publicationType = publication?.metadata?.attributes[0]?.value
  const showMore =
    publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]'

  return (
    <div className="break-words">
      {publicationType === 'community' ? (
        <div className="block items-center space-y-2 space-x-0 sm:flex sm:space-y-0 sm:space-x-2 linkify">
          <span className="flex items-center space-x-1.5">
            {publication?.collectedBy ? (
              <UserAddIcon className="w-4 h-4 text-brand" />
            ) : (
              <UsersIcon className="w-4 h-4 text-brand" />
            )}
            {publication?.collectedBy ? (
              <span>Joined</span>
            ) : (
              <span>Launched a new community</span>
            )}
          </span>
          <Link href={`/communities/${publication?.id}`}>
            <a
              href={`/communities/${publication?.id}`}
              className="flex items-center space-x-1.5 font-bold"
            >
              <img
                src={imagekitURL(
                  publication?.metadata?.cover?.original?.url
                    ? publication?.metadata?.cover?.original?.url
                    : `https://avatar.tobi.sh/${publication?.id}.png`,
                  'avatar'
                )}
                className="bg-gray-200 rounded ring-2 ring-gray-50 dark:bg-gray-700 dark:ring-black w-[19px] h-[19px]"
                height={19}
                width={19}
                alt={publication?.id}
              />
              <div>{publication?.metadata?.name}</div>
            </a>
          </Link>
        </div>
      ) : publicationType === 'crowdfund' ? (
        <Crowdfund fund={publication} />
      ) : (
        <>
          <div
            className={clsx({
              'line-clamp-5': showMore
            })}
          >
            <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
              <Markup>{publication?.metadata?.content}</Markup>
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
      {publication?.metadata?.media?.length > 0 ? (
        <Attachments attachments={publication?.metadata?.media} />
      ) : (
        publication?.metadata?.content &&
        publicationType !== 'crowdfund' &&
        publicationType !== 'community' &&
        getURLs(publication?.metadata?.content)?.length > 0 && (
          <IFramely url={getURLs(publication?.metadata?.content)[0]} />
        )
      )}
    </div>
  )
}

export default PublicationBody
