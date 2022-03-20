import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensHubPost } from '@generated/lenshubtypes'
import { CommentFragment } from '@gql/CommentFragment'
import { CollectionIcon } from '@heroicons/react/outline'
import React from 'react'
import useInView from 'react-cool-inview'

const PROFILE_FEED_QUERY = gql`
  query ProfileFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename
        ... on Comment {
          ...CommentFragment
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${CommentFragment}
`

interface Props {
  post: LensHubPost
}

const Feed: React.FC<Props> = ({ post }) => {
  const { data, loading, error, fetchMore } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: { commentsOf: post.pubId, limit: 10 }
    },
    skip: !post.pubId
  })

  const pageInfo = data?.publications?.pageInfo
  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            commentsOf: post.pubId,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
    }
  })

  if (loading) return <PostsShimmer />

  if (data?.publications?.items?.length === 0)
    return (
      <EmptyState
        message={<span>Be the first one to comment!</span>}
        icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
      />
    )

  return (
    <>
      {error && (
        <ErrorMessage title="Failed to load comment feed" error={error} />
      )}
      <div className="space-y-3">
        {data?.publications?.items?.map((post: LensHubPost, index: number) => (
          <SinglePost key={`${post.pubId}_${index}`} post={post} />
        ))}
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
