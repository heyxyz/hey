import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
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
import Custom404 from 'src/pages/404'

import NewComment from '../Comment/NewComment'
import CollectModule from './CollectModule'
import IPFSHash from './IPFSHash'
import SinglePost from './SinglePost'

export const POST_QUERY = gql`
  query Post($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...PostFragment
        ...PostCollectionFragment
        onChainContentURI
      }
      ... on Comment {
        ...CommentFragment
        ...CommentCollectionFragment
        onChainContentURI
      }
      ... on Mirror {
        ...MirrorFragment
        onChainContentURI
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
  ${MirrorFragment}
  ${PostCollectionFragment}
  ${CommentCollectionFragment}
`

const ViewPost: NextPage = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const id = router.query.id || []

  const { data, loading } = useQuery(POST_QUERY, {
    variables: { request: { publicationId: id[0] } },
    skip: !id[0]
  })

  if (loading || !data) return <PageLoading message="Loading post" />
  if (!data.publication) return <Custom404 />

  const post = data.publication

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <SinglePost post={post} />
        {currentUser && <NewComment post={post} />}
        <Feed post={post} />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card>
          <CardBody>
            <UserProfile profile={post.profile} />
          </CardBody>
        </Card>
        <IPFSHash ipfsHash={post.onChainContentURI} />
        {post?.collectModule?.type && (
          <CollectModule module={post.collectModule} />
        )}
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default ViewPost
