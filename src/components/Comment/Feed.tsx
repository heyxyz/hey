import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensHubPost } from '@generated/lenshubtypes'
import { CommentFragment } from '@gql/CommentFragment'
import { CollectionIcon } from '@heroicons/react/outline'
import React, { useContext } from 'react'
import useInView from 'react-cool-inview'

import NewComment from './NewComment'

const COMMENT_FEED_QUERY = gql`
  query CommentFeed($request: PublicationsQueryRequest!) {
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
  const { currentUser } = useContext(AppContext)
  const { data, loading, error, fetchMore, refetch } = useQuery(
    COMMENT_FEED_QUERY,
    {
      variables: {
        request: { commentsOf: post.pubId, limit: 10 }
      },
      skip: !post.pubId
    }
  )

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

  return (
    <>
      {currentUser && <NewComment refetch={refetch} post={post} />}
      {error && (
        <ErrorMessage title="Failed to load comment feed" error={error} />
      )}
      {data?.publications?.items?.length === 0 && (
        <EmptyState
          message={<span>Be the first one to comment!</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
        />
      )}
      <div className="space-y-3">
        {data?.publications?.items?.map((post: LensHubPost, index: number) => (
          <SinglePost
            key={`${post.pubId}_${index}`}
            post={post}
            type="COMMENT"
          />
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
