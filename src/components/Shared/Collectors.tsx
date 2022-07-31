import { gql, useQuery } from '@apollo/client'
import UserProfile from '@components/Shared/UserProfile'
import WalletProfile from '@components/Shared/WalletProfile'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { PaginatedResultInfo, Wallet } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { CollectionIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'

import Loader from './Loader'

const COLLECTORS_QUERY = gql`
  query Collectors($request: WhoCollectedPublicationRequest!) {
    whoCollectedPublication(request: $request) {
      items {
        address
        defaultProfile {
          ...MinimalProfileFields
          isFollowedByMe
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  pubId: string
}

const Collectors: FC<Props> = ({ pubId }) => {
  const [collectors, setCollectors] = useState<Wallet[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(COLLECTORS_QUERY, {
    variables: { request: { publicationId: pubId, limit: 10 } },
    skip: !pubId,
    onCompleted(data) {
      setPageInfo(data?.whoCollectedPublication?.pageInfo)
      setCollectors(data?.whoCollectedPublication?.items)
      Logger.log('[Query]', `Fetched first 10 collectors Publication:${pubId}`)
    },
    onError(error) {
      Logger.error('[Query Error]', error)
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            publicationId: pubId,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
      setPageInfo(data?.whoCollectedPublication?.pageInfo)
      setCollectors([...collectors, ...data?.whoCollectedPublication?.items])
      Logger.log(
        '[Query]',
        `Fetched next 10 collectors Publication:${pubId} Next:${pageInfo?.next}`
      )
    }
  })

  if (loading) return <Loader message="Loading collectors" />

  if (data?.whoCollectedPublication?.items?.length === 0)
    return (
      <div className="p-5">
        <EmptyState
          message={<span>No collectors.</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
          hideCard
        />
      </div>
    )

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage
        className="m-5"
        title="Failed to load collectors"
        error={error}
      />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {collectors?.map((wallet: Wallet) => (
            <div className="p-5" key={wallet?.address}>
              {wallet?.defaultProfile ? (
                <UserProfile
                  profile={wallet?.defaultProfile}
                  showBio
                  showFollow
                  isFollowing={wallet?.defaultProfile?.isFollowedByMe}
                />
              ) : (
                <WalletProfile wallet={wallet} />
              )}
            </div>
          ))}
        </div>
        {pageInfo?.next && collectors.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default Collectors
