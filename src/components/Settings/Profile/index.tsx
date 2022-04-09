import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Sidebar from '../Sidebar'
import Picture from './Picture'
import Profile from './Profile'

const PROFILE_SETTINGS_QUERY = gql`
  query ProfileSettings($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        location
        website
        twitterUrl
        bio
        coverPicture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        picture {
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

const ProfileSettings: NextPage = () => {
  const { currentUser } = useContext(AppContext)
  const { data, loading, error } = useQuery(PROFILE_SETTINGS_QUERY, {
    variables: { request: { profileIds: currentUser?.id } },
    skip: !currentUser?.id,
    onCompleted() {
      consoleLog('Fetch', '#8b5cf6', `Fetched profile settings`)
    }
  })

  if (error) return <Custom500 />
  if (loading) return <PageLoading message="Loading settings" />
  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title="Profile settings • Lenster" />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Profile profile={data?.profiles?.items[0]} />
        <Picture profile={data?.profiles?.items[0]} />
      </GridItemEight>
    </GridLayout>
  )
}

export default ProfileSettings
