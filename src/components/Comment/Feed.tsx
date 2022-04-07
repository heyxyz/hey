import { gql, useQuery } from '@apollo/client'
import SinglePost from '@components/Post/SinglePost'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import Slug from '@components/Shared/Slug'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { PaginatedResultInfo } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { CollectionIcon, UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { useInView } from 'react-cool-inview'

import NewComment from './NewComment'

const COMMENT_FEED_QUERY = gql`
  query CommentFeed($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename
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

const Feed: React.FC<Props> = ({
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
      })
    }
  })

  if (loading) return <PostsShimmer />

  return (
    <>
      {currentUser &&
        (isFollowing || !onlyFollowers ? (
          <NewComment refetch={refetch} post={post} type={type} />
        ) : (
          <Card>
            <CardBody className="flex items-center space-x-1 text-sm font-bold text-gray-500">
              <UsersIcon className="w-4 h-4 text-brand-500" />
              <div>
                <span>Only </span>
                <Slug slug={`${post.profile.handle}'s`} prefix="@" />
                <span> followers can comment</span>
              </div>
            </CardBody>
          </Card>
        ))}
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
  )
}

export default Feed
