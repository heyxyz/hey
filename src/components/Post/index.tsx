import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { LensterPost } from '@generated/lenstertypes'
import { Profile } from '@generated/types'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FC, useContext } from 'react'
import { ZERO_ADDRESS } from 'src/constants'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import IPFSHash from './IPFSHash'
import PostPageShimmer from './Shimmer'
import SinglePost from './SinglePost'
import ViaLenster from './ViaLenster'

export const FOLLOW_QUERY = gql`
  query Post($followRequest: DoesFollowRequest!) {
    doesFollow(request: $followRequest) {
      follows
    }
  }
`

const ViewPost: NextPage<{
  id: string
  post: LensterPost
}> = ({ id, post }) => {
  const profile =
    post?.__typename === 'Mirror' ? post?.mirrorOf?.profile : post?.profile

  return (
    <>
      <SEO
        title={
          profile?.handle && `${profile?.name} (${profile.handle}) on Lenster:`
        }
        description={post && post.metadata?.content}
      />
      <PostRender id={id} post={post} profile={profile} />
    </>
  )
}

const PostRender: FC<{ id: string; post: LensterPost; profile: Profile }> = ({
  id,
  post,
  profile
}) => {
  const { currentUser } = useContext(AppContext)
  const { isFallback } = useRouter()
  const {
    data: followData,
    loading,
    error
  } = useQuery(FOLLOW_QUERY, {
    variables: {
      followRequest: {
        followInfos: {
          followerAddress: currentUser?.ownedBy
            ? currentUser?.ownedBy
            : ZERO_ADDRESS,
          profileId: id?.toString().split('-')[0]
        }
      }
    },
    skip: !id,
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched publication details Publication:${id}`
      )
    }
  })

  if (error) return <Custom500 />
  if (loading || isFallback) return <PostPageShimmer />
  if (!post) return <Custom404 />

  return (
    <GridLayout>
      <SEO
        title={`${profile?.name} (${profile.handle}) on Lenster:`}
        description={post.metadata.content}
      />
      <GridItemEight className="space-y-5">
        <SinglePost post={post} />
        <Feed
          post={post}
          onlyFollowers={
            post?.referenceModule?.__typename ===
            'FollowOnlyReferenceModuleSettings'
          }
          isFollowing={followData?.doesFollow[0]?.follows}
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
          {post?.appId === 'Lenster' && <ViaLenster />}
        </Card>
        <IPFSHash ipfsHash={post?.onChainContentURI} />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default ViewPost
