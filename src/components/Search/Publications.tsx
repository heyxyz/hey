import { gql, useQuery } from '@apollo/client'
import SinglePublication from '@components/Publication/SinglePublication'
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPublication } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { PostFields } from '@gql/PostFields'
import { CollectionIcon } from '@heroicons/react/outline'
import { Mixpanel } from '@lib/mixpanel'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useAppPersistStore } from 'src/store/app'
import { PAGINATION } from 'src/tracking'

const SEARCH_PUBLICATIONS_QUERY = gql`
  query SearchPublications(
    $request: SearchQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    search(request: $request) {
      ... on PublicationSearchResult {
        items {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentFields
          }
        }
        pageInfo {
          next
          totalCount
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
`

interface Props {
  query: string | string[]
}

const Publications: FC<Props> = ({ query }) => {
  const { currentUser } = useAppPersistStore()
  const [publications, setPublications] = useState<LensterPublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(
    SEARCH_PUBLICATIONS_QUERY,
    {
      variables: {
        request: { query, type: 'PUBLICATION', limit: 10 },
        reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
        profileId: currentUser?.id ?? null
      },
      onCompleted(data) {
        setPageInfo(data?.search?.pageInfo)
        setPublications(data?.search?.items)
      }
    }
  )

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            query,
            type: 'PUBLICATION',
            cursor: pageInfo?.next,
            limit: 10
          },
          reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
          profileId: currentUser?.id ?? null
        }
      })
      setPageInfo(data?.search?.pageInfo)
      setPublications([...publications, ...data?.search?.items])
      Mixpanel.track(PAGINATION.PUBLICATION_SEARCH, { pageInfo })
    }
  })

  return (
    <>
      {loading && <PublicationsShimmer />}
      {data?.search?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              No publications for <b>&ldquo;{query}&rdquo;</b>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load publications list" error={error} />
      {!error && !loading && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {publications?.map((post: LensterPublication, index: number) => (
              <SinglePublication
                key={`${post?.id}_${index}`}
                publication={post}
              />
            ))}
          </Card>
          {pageInfo?.next && publications.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Publications
