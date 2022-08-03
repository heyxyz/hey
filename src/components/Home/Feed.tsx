import { gql, useQuery } from '@apollo/client'
import NewPost from '@components/Post/NewPost'
import SinglePublication from '@components/Post/SinglePublication'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import { CollectionIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useAppPersistStore } from 'src/store/app'

const HOME_FEED_QUERY = gql`
  query HomeFeed(
    $request: TimelineRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    timeline(request: $request) {
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
        totalCount
      }
    }
  }
  ${PostFields}
  ${MirrorFields}
  ${CommentFields}
`

const Feed: FC = () => {
  const { currentUser } = useAppPersistStore()
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(HOME_FEED_QUERY, {
    variables: {
      request: { profileId: currentUser?.id, limit: 10 },
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setPageInfo(data?.timeline?.pageInfo)
      setPublications(data?.timeline?.items)
      Logger.log('[Query]', `Fetched first 10 timeline publications`)
    },
    onError(error) {
      Logger.error('[Query Error]', error)
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            profileId: currentUser?.id,
            cursor: pageInfo?.next,
            limit: 10
          },
          reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
          profileId: currentUser?.id ?? null
        }
      })
      setPageInfo(data?.timeline?.pageInfo)
      setPublications([...publications, ...data?.timeline?.items])
      Logger.log(
        '[Query]',
        `Fetched next 10 timeline publications Next:${pageInfo?.next}`
      )
    }
  })

  return (
    <>
      {currentUser && <NewPost />}
      {loading && <PostsShimmer />}
      {data?.timeline?.items?.length === 0 && (
        <EmptyState
          message={<div>No posts yet!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load home feed" error={error} />
      {!error && !loading && data?.timeline?.items?.length !== 0 && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {publications?.map((post: LensterPost, index: number) => (
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

export default Feed
