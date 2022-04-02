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
import { CommentFragment } from '@gql/CommentFragment'
import { CollectionIcon, UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
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
  const { data, loading, error, fetchMore, refetch } = useQuery(
    COMMENT_FEED_QUERY,
    {
      variables: {
        request: { commentsOf: id, limit: 10 }
      },
      skip: !id
    }
  )

  const pageInfo = data?.publications?.pageInfo
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
        {data?.publications?.items?.map((post: LensterPost, index: number) => (
          <SinglePost key={`${post.id}_${index}`} post={post} type="COMMENT" />
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
