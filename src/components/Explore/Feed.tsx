import { gql, useQuery } from '@apollo/client'
import MinimalSinglePost from '@components/Post/MinimalSinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import { CollectionIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import React, { FC, useState } from 'react'
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

const Feed: FC<Props> = ({ feedType = 'TOP_COMMENTED' }) => {
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(EXPLORE_FEED_QUERY, {
    variables: {
      request: {
        sortCriteria: feedType,
        limit: 5,
        noRandomize: feedType === 'LATEST'
      }
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setPublications(data?.explorePublications?.items)
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched first 5 explore publications FeedType:${feedType}`
      )
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
            limit: 5,
            noRandomize: feedType === 'LATEST'
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.explorePublications?.pageInfo)
        setPublications([...publications, ...data?.explorePublications?.items])
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched next 10 explore publications FeedType:${feedType} Next:${pageInfo?.next}`
        )
      })
    }
  })

  return (
    <>
      {loading && <PostsShimmer />}
      {data?.explorePublications?.items?.length === 0 && (
        <EmptyState
          message={<div>No posts yet!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load explore feed" error={error} />
      {!error && !loading && (
        <>
          <div className="space-y-3">
            {publications?.map((post: LensterPost, index: number) => (
              <MinimalSinglePost key={`${post?.id}_${index}`} post={post} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default Feed
