import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { PageLoading } from '@components/UI/PageLoading'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Custom404 from 'src/pages/404'

import Cover from './Cover'
import Details from './Details'
import Feed from './Feed'
import FeedType from './FeedType'
import NFTFeed from './NFTFeed'

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
        twitterUrl
        bio
        stats {
          totalFollowers
          totalFollowing
        }
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        coverPicture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
      }
    }
  }
`

const ViewProfile: NextPage = () => {
  const {
    query: { username }
  } = useRouter()
  const [feedType, setFeedType] = useState<string>('POST')
  const { data, loading } = useQuery(PROFILE_QUERY, {
    variables: { request: { handles: username } },
    skip: !username
  })

  if (loading || !data) return <PageLoading message="Loading user" />
  if (data?.profiles?.items?.length === 0) return <Custom404 />

  const profile = data?.profiles?.items[0]

  return (
    <>
      <Cover cover={profile?.coverPicture?.original?.url} />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details profile={profile} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType setFeedType={setFeedType} feedType={feedType} />
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
