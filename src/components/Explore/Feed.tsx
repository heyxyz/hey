import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import { CollectionIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

const EXPLORE_FEED_QUERY = gql`
  query ExploreFeed($request: ExplorePublicationRequest!) {
    explorePublications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

interface Props {
  feedType?: string
}

const Feed: React.FC<Props> = ({ feedType = 'TOP_COMMENTED' }) => {
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(EXPLORE_FEED_QUERY, {
    variables: {
      request: {
        sortCriteria: feedType,
        limit: 10,
        noRandomize: feedType === 'LATEST'
      }
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setPublications(data?.explorePublications?.items)
    }
  })

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            sortCriteria: feedType,
            cursor: pageInfo?.next,
            limit: 10,
            noRandomize: feedType === 'LATEST'
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.explorePublications?.pageInfo)
        setPublications([...publications, ...data?.explorePublications?.items])
      })
    }
  })

  return (
    <>
      {loading && <PostsShimmer />}
      {data?.explorePublications?.items?.length === 0 && (
        <EmptyState
          message={<div>No posts yet!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
        />
      )}
      <ErrorMessage title="Failed to load explore feed" error={error} />
      {!error && (
        <>
          <div className="space-y-3" data-cy="explore-feed">
            {publications?.map((post: LensterPost, index: number) => (
              <SinglePost key={`${post.id}_${index}`} post={post} />
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Feed
