import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { CollectionIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import { useRouter } from 'next/router'
import React, { FC, useContext, useState } from 'react'
import { useInView } from 'react-cool-inview'

import NewComment from './NewComment'
import ReferenceAlert from './ReferenceAlert'

const COMMENT_FEED_QUERY = gql`
  query CommentFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
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
  const {
    query: { id }
  } = useRouter()
  const { currentUser } = useContext(AppContext)
  const [publications, setPublications] = useState<LensterPost[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore, refetch } = useQuery(
    COMMENT_FEED_QUERY,
    {
      variables: {
        request: { commentsOf: id, limit: 10 }
      },
      skip: !id,
      onCompleted(data) {
        setPageInfo(data?.publications?.pageInfo)
        setPublications(data?.publications?.items)
        consoleLog(
          'Fetch',
          '#8b5cf6',
          `Fetched first 10 comments of Publication:${id}`
        )
      }
    }
  )

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            commentsOf: post.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo)
        setPublications([...publications, ...data?.publications?.items])
        consoleLog(
          'Fetch',
          '#8b5cf6',
          `Fetched next 10 comments of Publication:${id} Next:${pageInfo?.next}`
        )
      })
    }
  })

  return (
    <>
      {currentUser &&
        (isFollowing || !onlyFollowers ? (
          <NewComment refetch={refetch} post={post} type={type} />
        ) : (
          <ReferenceAlert
            handle={post?.profile?.handle}
            isSuperFollow={post?.profile?.followModule ? true : false}
            action="comment"
          />
        ))}
      {loading && <PostsShimmer />}
      {data?.publications?.items?.length === 0 && (
        <EmptyState
          message={<span>Be the first one to comment!</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
        />
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />
      {!error && (
        <>
          <div className="space-y-3">
            {publications?.map((post: LensterPost, index: number) => (
              <SinglePost key={`${post.id}_${index}`} post={post} hideType />
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
