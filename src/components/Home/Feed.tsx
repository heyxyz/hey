import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import NewPostShimmer from '@components/Shared/Shimmer/NewPostShimmer'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { CommentFragment } from '@gql/CommentFragment'
import { MirrorFragment } from '@gql/MirrorFragment'
import { PostFragment } from '@gql/PostFragment'
import { CollectionIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import React, { useContext } from 'react'
import useInView from 'react-cool-inview'

const NewPost = dynamic(() => import('../Post/NewPost'), {
  loading: () => (
    <Card>
      <NewPostShimmer />
    </Card>
  )
})

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

  return (
    <>
      {currentUser && <NewPost refetch={refetch} />}
      {error && <ErrorMessage title="Failed to load home feed" error={error} />}
      {data?.timeline?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              <span>No posts yet!</span>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
        />
      )}
      <div className="space-y-3">
        {data?.timeline?.items?.map((post: LensterPost, index: number) => (
          <SinglePost key={`${post.id}_${index}`} post={post} />
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
