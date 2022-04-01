import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import {
  CommentCollectionFragment,
  PostCollectionFragment
} from '@gql/CollectionFragment'
import { CommentFragment } from '@gql/CommentFragment'
import { MirrorFragment } from '@gql/MirrorFragment'
import { PostFragment } from '@gql/PostFragment'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ZERO_ADDRESS } from 'src/constants'
import Custom404 from 'src/pages/404'

import IPFSHash from './IPFSHash'
import PostPageShimmer from './Shimmer'
import SinglePost from './SinglePost'
import ViaLenster from './ViaLenster'

export const POST_QUERY = gql`
  query Post(
    $request: PublicationQueryRequest!
    $followRequest: DoesFollowRequest!
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFragment
        ...PostCollectionFragment
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFragment
        ...CommentCollectionFragment
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFragment
        onChainContentURI
        referenceModule {
          __typename
        }
      }
    }
    doesFollow(request: $followRequest) {
      follows
    }
  }
  ${PostFragment}
  ${CommentFragment}
  ${MirrorFragment}
  ${PostCollectionFragment}
  ${CommentCollectionFragment}
`

const ViewPost: NextPage = () => {
  const {
    query: { id }
  } = useRouter()

  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery(POST_QUERY, {
    variables: {
      request: { publicationId: id },
      followRequest: {
        followInfos: {
          followerAddress: currentUser?.ownedBy
            ? currentUser?.ownedBy
            : ZERO_ADDRESS,
          profileId: id?.toString().split('-')[0]
        }
      }
    },
    skip: !id
  })

  if (!loading || !data) return <PostPageShimmer />
  if (!data.publication) return <Custom404 />

  const post: LensterPost = data.publication

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <SinglePost post={post} />
        <Feed
          post={post}
          onlyFollowers={
            post.referenceModule?.__typename ===
            'FollowOnlyReferenceModuleSettings'
          }
          isFollowing={data?.doesFollow[0]?.follows}
        />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card>
          <CardBody>
            <UserProfile profile={post.profile} />
          </CardBody>
          {post?.appId === 'Lenster' && <ViaLenster />}
        </Card>
        <IPFSHash ipfsHash={post.onChainContentURI} />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default ViewPost
