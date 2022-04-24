import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Explore/Feed'
import MinimalFeed from '@components/Explore/MinimalFeed'
import { GridLayout } from '@components/GridLayout'
import { GridItemTwelve } from '@components/GridLayout'
import Details from '@components/Profile/Details'
import Sponsors from '@components/Shared/Sponsors'
import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import HomeFeed from './Feed'
import Hero from './Hero'
import Logos from './Logos'

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

const Home: NextPage = () => {
  const { currentUser } = useContext(AppContext)
  const username = currentUser?.handle
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
  if (data?.profiles?.items?.length === 0) return <Custom404 />

  const profile = data?.profiles?.items[0]
  return (
    <>
      <SEO />
      {!currentUser && (
        <div>
          <Hero />
          <Logos />
        </div>
      )}
      {currentUser && (
        <div
          className="flex justify-between space-x-8 p-10"
          style={{ maxHeight: '600px' }}
        >
          {/* PROFILE CARD */}
          <Card>
            <CardBody className="space-y-6">
              <GridLayout className="pt-6">
                <GridItemTwelve className="flex justify-center">
                  <Details profile={profile} />
                </GridItemTwelve>
              </GridLayout>
            </CardBody>
          </Card>
          {/* END OF PROFILE CARD */}
          {/* YOUR RECENT ACTIVITIES CARD */}
          <Card>
            <CardBody className="space-y-6">
              <GridLayout className="pt-6">
                <GridItemTwelve className="space-y-5">
                  <h1>YOUR RECENT ACTIVITIES</h1>
                  <HomeFeed />
                </GridItemTwelve>
              </GridLayout>
            </CardBody>
          </Card>
          {/* END OF*/}
          {/* YOUR FRIENDS RECENT ACTIVITIES CARD */}
          <Card>
            <CardBody className="space-y-6">
              <GridLayout className="pt-6">
                <GridItemTwelve className="space-y-5">
                  <h1>YOUR FRIENDS RECENT ACTIVITIES</h1>
                  <MinimalFeed feedType="LATEST" />
                </GridItemTwelve>
              </GridLayout>
            </CardBody>
          </Card>
          {/* END OF */}
        </div>
      )}
      <div className="p-5">
        <Card>
          <CardBody className="space-y-6">
            <GridItemTwelve className="space-y-5">
              <h1>Filters</h1>
              <Feed feedType="LATEST" />
            </GridItemTwelve>
          </CardBody>
        </Card>
      </div>
      <GridLayout>
        <Sponsors></Sponsors>
      </GridLayout>
    </>
  )
}

export default Home
