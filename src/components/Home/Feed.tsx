import { gql, useQuery } from '@apollo/client'
import NewPost from '@components/Post/NewPost'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFragment } from '@gql/CommentFragment'
import { MirrorFragment } from '@gql/MirrorFragment'
import { PostFragment } from '@gql/PostFragment'
import { CollectionIcon } from '@heroicons/react/outline'
import React, { useContext, useState } from 'react'
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
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [page, setPage] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore, refetch } = useQuery(
    HOME_FEED_QUERY,
    {
      variables: {
        request: { profileId: currentUser?.id, limit: 10 }
      },
      skip: !currentUser?.id,
      onCompleted(data) {
        setPage(data?.timeline?.pageInfo)
        setPublications(data?.timeline?.items)
      }
    }
  )

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: currentUser?.id,
            cursor: page?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPage(data?.timeline?.pageInfo)
        setPublications([...publications, ...data?.timeline?.items])
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
        {publications?.map((post: LensterPost, index: number) => (
          <SinglePost key={`${post.id}_${index}`} post={post} />
        ))}
      </div>
      {page?.next && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </>
  )
}

export default Feed
