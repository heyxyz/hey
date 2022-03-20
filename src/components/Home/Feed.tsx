import { gql, useQuery } from '@apollo/client'
import NewPost from '@components/Post/NewPost'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensHubPost } from '@generated/lenshubtypes'
import { CommentFragment } from '@gql/CommentFragment'
import { MirrorFragment } from '@gql/MirrorFragment'
import { PostFragment } from '@gql/PostFragment'
import { CollectionIcon } from '@heroicons/react/outline'
import React, { useContext } from 'react'
import useInView from 'react-cool-inview'

const HOME_FEED_QUERY = gql`
  query HomeFeed($request: TimelineRequest!) {
    timeline(request: $request) {
      items {
        ... on Post {
          collectedBy {
            defaultProfile {
              handle
            }
          }
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
  ${MirrorFragment}
  ${CommentFragment}
`

const Feed: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const { data, loading, error, fetchMore, refetch } = useQuery(
    HOME_FEED_QUERY,
    {
      variables: {
        request: { profileId: currentUser?.id, limit: 10 }
      },
      skip: !currentUser?.id
    }
  )

  const pageInfo = data?.timeline?.pageInfo
  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: currentUser?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
    }
  })

  if (loading) return <PostsShimmer />

  if (data?.timeline?.items?.length === 0)
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
      {currentUser && <NewPost refetch={refetch} />}
      {error && <ErrorMessage title="Failed to load home feed" error={error} />}
      <div className="space-y-3">
        {data?.timeline?.items?.map((post: LensHubPost, index: number) => (
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
