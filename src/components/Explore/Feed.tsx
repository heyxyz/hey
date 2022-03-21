import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { CommentFragment } from '@gql/CommentFragment'
import { MirrorFragment } from '@gql/MirrorFragment'
import { PostFragment } from '@gql/PostFragment'
import { CollectionIcon } from '@heroicons/react/outline'
import React from 'react'
import useInView from 'react-cool-inview'

const EXPLORE_FEED_QUERY = gql`
  query ExploreFeed($request: ExplorePublicationRequest!) {
    explorePublications(request: $request) {
      items {
        ... on Post {
          ...PostFragment
        }
        ... on Comment {
          ...CommentFragment
        }
        ... on Mirror {
          ...MirrorFragment
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
  ${MirrorFragment}
`

const Feed: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery(EXPLORE_FEED_QUERY, {
    variables: {
      request: { sortCriteria: 'TOP_COMMENTED', limit: 10 }
    }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            sortCriteria: 'TOP_COMMENTED',
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
    }
  })

  if (loading) return <PostsShimmer />

  if (data?.explorePublications?.items?.length === 0)
    return (
      <EmptyState
        message={
          <div>
            <span>No posts yet!</span>
          </div>
        }
        icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
      />
    )

  return (
    <>
      {error && (
        <ErrorMessage title="Failed to load explore feed" error={error} />
      )}
      <div className="space-y-3">
        {data?.explorePublications?.items?.map(
          (post: LensterPost, index: number) => (
            <SinglePost key={`${post.pubId}_${index}`} post={post} />
          )
        )}
      </div>
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </>
  )
}

export default Feed
