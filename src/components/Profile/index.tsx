import { gql } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SEO from '@components/utils/SEO'
import { MediaSet, Profile } from '@generated/types'
import getAvatar from '@lib/getAvatar'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Custom404 from 'src/pages/404'

import Cover from './Cover'
import Details from './Details'
import Feed from './Feed'
import FeedType from './FeedType'
import NFTFeed from './NFTFeed'
import ProfilePageShimmer from './Shimmer'

export const PROFILE_QUERY = gql`
  query Profile($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        handle
        ownedBy
        name
        attributes {
          key
          value
        }
        bio
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
        }
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
          ... on NftImage {
            uri
          }
        }
        coverPicture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        followModule {
          __typename
        }
      }
    }
  }
`

const ViewProfile: NextPage<{ username: string; profile: Profile }> = ({
  profile
}) => {
  const { isFallback } = useRouter()
  const {
    query: { type }
  } = useRouter()
  const [feedType, setFeedType] = useState<string>(
    type && ['post', 'comment', 'mirror', 'nft'].includes(type as string)
      ? type?.toString().toUpperCase()
      : 'POST'
  )

  if (isFallback) return <ProfilePageShimmer />
  if (!profile) return <Custom404 />

  return (
    <>
      <SEO
        title={
          profile?.name
            ? `${profile?.name} (@${profile?.handle}) • Lenster`
            : `@${profile?.handle} • Lenster`
        }
        description={profile && profile?.bio!}
        image={profile && getAvatar(profile)}
      />
      <Cover cover={(profile?.coverPicture as MediaSet)?.original?.url} />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details profile={profile} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType
            stats={profile?.stats}
            setFeedType={setFeedType}
            feedType={feedType}
          />
          {(feedType === 'POST' ||
            feedType === 'COMMENT' ||
            feedType === 'MIRROR') && (
            <Feed profile={profile} type={feedType} />
          )}
          {feedType === 'NFT' && <NFTFeed profile={profile} />}
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default ViewProfile
