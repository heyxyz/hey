import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import SEO from '@components/utils/SEO'
import { LensterPost } from '@generated/lenstertypes'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import Logger from '@lib/logger'
import { apps } from 'data/apps'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import { APP_NAME } from 'src/constants'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { useAppPersistStore } from 'src/store/app'

import IPFSHash from './IPFSHash'
import PostPageShimmer from './Shimmer'
import SinglePost from './SinglePost'
import ViaApp from './ViaApp'

const Feed = dynamic(() => import('@components/Comment/Feed'), {
  loading: () => <PostsShimmer />
})

export const POST_QUERY = gql`
  query Post(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFields
        onChainContentURI
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFields
        onChainContentURI
        profile {
          isFollowedByMe
        }
        referenceModule {
          __typename
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

const ViewPost: NextPage = () => {
  const {
    query: { id }
  } = useRouter()

  const { currentUser } = useAppPersistStore()
  const { data, loading, error } = useQuery(POST_QUERY, {
    variables: {
      request: { publicationId: id },
      reactionRequest: currentUser ? { profileId: currentUser?.id } : null,
      profileId: currentUser?.id ?? null
    },
    skip: !id,
    onCompleted() {
      Logger.log('[Query]', `Fetched publication details Publication:${id}`)
    }
  })

  if (error) return <Custom500 />
  if (loading || !data) return <PostPageShimmer />
  if (!data.publication) return <Custom404 />

  const post: LensterPost = data.publication
  const appConfig = apps.filter((e) => e.id === post?.appId)[0]

  return (
    <GridLayout>
      <SEO
        title={`${post?.__typename} by @${post?.profile?.handle} • ${APP_NAME}`}
      />
      <GridItemEight className="space-y-5">
        <Card>
          <SinglePost post={post} showThread />
        </Card>
        <Feed
          post={post}
          onlyFollowers={
            post?.referenceModule?.__typename ===
            'FollowOnlyReferenceModuleSettings'
          }
          isFollowing={post?.profile?.isFollowedByMe}
        />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card>
          <CardBody>
            <UserProfile
              profile={
                post?.__typename === 'Mirror'
                  ? post?.mirrorOf?.profile
                  : post?.profile
              }
              showBio
            />
          </CardBody>
          <ViaApp appConfig={appConfig} />
        </Card>
        <IPFSHash ipfsHash={post?.onChainContentURI} />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default ViewPost
