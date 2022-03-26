import { gql, useQuery } from '@apollo/client'
import UserProfile from '@components/Shared/UserProfile'
import WalletProfile from '@components/Shared/WalletProfile'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Profile, Wallet } from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import useInView from 'react-cool-inview'

const COLLECTORS_QUERY = gql`
  query Collectors($request: WhoCollectedPublicationRequest!) {
    whoCollectedPublication(request: $request) {
      items {
        address
        defaultProfile {
          id
          name
          handle
          ownedBy
          picture {
            ... on MediaSet {
              original {
                url
              }
            }
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
`

interface Props {
  pubId: string
}

const Collectors: React.FC<Props> = ({ pubId }) => {
  const { data, loading, error, fetchMore } = useQuery(COLLECTORS_QUERY, {
    variables: { request: { publicationId: pubId, limit: 10 } },
    skip: !pubId
  })

  const pageInfo = data?.whoCollectedPublication?.pageInfo
  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            publicationId: pubId,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
    }
  })

  if (loading)
    return (
      <div className="p-5 space-y-2 font-bold text-center">
        <Spinner size="md" className="mx-auto" />
        <div>Loading collectors</div>
      </div>
    )

  if (data?.whoCollectedPublication?.items?.length === 0)
    return (
      <div className="p-5">
        <EmptyState
          message={<span>No collectors.</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
          hideCard
        />
      </div>
    )

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        title="Failed to load collectors"
        error={error}
      />
      <div className="space-y-3">
        <div className="divide-y">
          {data?.whoCollectedPublication?.items?.map((wallet: Wallet) => (
            <div className="p-5" key={wallet?.defaultProfile?.id}>
              {wallet?.defaultProfile ? (
                <UserProfile profile={wallet?.defaultProfile as Profile} />
              ) : (
                <WalletProfile wallet={wallet} />
              )}
            </div>
          ))}
        </div>
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default Collectors
