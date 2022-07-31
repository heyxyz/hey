import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { CollectionIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useAppPersistStore } from 'src/store/app'

import ReferenceAlert from '../Shared/ReferenceAlert'
import NewComment from './NewComment'

const COMMENT_FEED_QUERY = gql`
  query CommentFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFields}
`

interface Props {
  post: LensterPost
  type?: 'comment' | 'community post'
  onlyFollowers?: boolean
  isFollowing?: boolean
}

const Feed: FC<Props> = ({
  post,
  type = 'comment',
  onlyFollowers = false,
  isFollowing = true
}) => {
  const pubId = post?.__typename === 'Mirror' ? post?.mirrorOf?.id : post?.id
  const { currentUser } = useAppPersistStore()
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(COMMENT_FEED_QUERY, {
    variables: {
      request: { commentsOf: pubId, limit: 10 },
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    skip: !pubId,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo)
      setPublications(data?.publications?.items)
      Logger.log('[Query]', `Fetched first 10 comments of Publication:${pubId}`)
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
            commentsOf: pubId,
            cursor: pageInfo?.next,
            limit: 10
          },
          reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
          profileId: currentUser?.id ?? null
        }
      })
      setPageInfo(data?.publications?.pageInfo)
      setPublications([...publications, ...data?.publications?.items])
      Logger.log(
        '[Query]',
        `Fetched next 10 comments of Publication:${pubId} Next:${pageInfo?.next}`
      )
    }
  })

  return (
    <>
      {currentUser &&
        (isFollowing || !onlyFollowers ? (
          <NewComment post={post} type={type} />
        ) : (
          <ReferenceAlert
            handle={post?.profile?.handle}
            isSuperFollow={
              post?.profile?.followModule?.__typename ===
              'FeeFollowModuleSettings'
            }
            action="comment"
          />
        ))}
      {loading && <PostsShimmer />}
      {data?.publications?.items?.length === 0 && (
        <EmptyState
          message={<span>Be the first one to comment!</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />
      {!error && !loading && data?.publications?.items?.length !== 0 && (
        <>
          <Card
            className="divide-y-[1px] dark:divide-gray-700/80"
            testId="comment-feed"
          >
            {publications?.map((post: LensterPost, index: number) => (
              <SinglePost
                key={`${pubId}_${index}`}
                post={post}
                showType={false}
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
