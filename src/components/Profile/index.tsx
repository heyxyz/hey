import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SEO from '@components/utils/SEO'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Cover from './Cover'
import Details from './Details'
import Feed from './Feed'
import FeedType from './FeedType'
import NFTFeed from './NFTFeed'
import POAPFeed from './POAPFeed'
import ProfilePageShimmer from './Shimmer'

export const PROFILE_QUERY = gql`
  query Profile($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        handle
        ownedBy
        name
        location
        website
        twitter
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

const ViewProfile: NextPage = () => {
  const {
    query: { username, type }
  } = useRouter()
  const [feedType, setFeedType] = useState<string>(
    type && ['post', 'comment', 'mirror', 'nft'].includes(type as string)
      ? type?.toString().toUpperCase()
      : 'POST'
  )
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { request: { handles: username } },
    skip: !username,
    onCompleted(data) {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched profile details Profile:${data?.profiles?.items[0]?.id}`
      )
    }
  })

  if (error) return <Custom500 />
  if (loading || !data) return <ProfilePageShimmer />
  if (data?.profiles?.items?.length === 0) return <Custom404 />

  const profile = data?.profiles?.items[0]

  return (
    <>
      {profile?.name ? (
        <SEO title={`${profile?.name} (@${profile?.handle}) • Lenster`} />
      ) : (
        <SEO title={`@${profile?.handle} • Lenster`} />
      )}
      <Cover cover={profile?.coverPicture?.original?.url} />
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
          {feedType === 'POAP' && <POAPFeed profile={profile} />}
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default ViewProfile
