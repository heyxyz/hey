import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { PhotographIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import clsx from 'clsx'
import { NextPage } from 'next'
import React, { FC, ReactChild, useContext, useState } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Sidebar from '../Sidebar'
import NFTPicture from './NFTPicture'
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
        twitter
        bio
        attributes {
          key
          value
        }
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
          ... on NftImage {
            uri
            tokenId
          }
        }
      }
    }
  }
`

const ProfileSettings: NextPage = () => {
  const { currentUser } = useContext(AppContext)
  const [settingsType, setSettingsType] = useState<'NFT' | 'AVATAR'>('AVATAR')
  const { data, loading, error } = useQuery(PROFILE_SETTINGS_QUERY, {
    variables: { request: { profileIds: currentUser?.id } },
    skip: !currentUser?.id,
    onCompleted(data) {
      consoleLog('Query', '#8b5cf6', `Fetched profile settings`)
      setSettingsType(data?.profiles?.items[0]?.picture?.uri ? 'NFT' : 'AVATAR')
    }
  })

  if (error) return <Custom500 />
  if (loading) return <PageLoading message="Loading settings" />
  if (!currentUser) return <Custom404 />

  const profile = data?.profiles?.items[0]

  interface TypeButtonProps {
    name: string
    icon: ReactChild
    type: 'NFT' | 'AVATAR'
  }

  const TypeButton: FC<TypeButtonProps> = ({ name, icon, type }) => (
    <button
      type="button"
      onClick={() => {
        setSettingsType(type)
      }}
      className={clsx(
        {
          'text-brand bg-brand-100 dark:bg-opacity-20 bg-opacity-100 font-bold':
            settingsType === type
        },
        'flex items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand hover:bg-brand-100 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
    >
      {icon}
      <div className="hidden sm:block">{name}</div>
    </button>
  )

  return (
    <GridLayout>
      <SEO title="Profile settings • Lenster" />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Profile profile={profile} />
        <Card>
          <CardBody className="space-y-5">
            <div className="flex items-center space-x-2">
              <TypeButton
                icon={<PhotographIcon className="h-5 w-5" />}
                type="AVATAR"
                name="Upload avatar"
              />
              <TypeButton
                icon={<PhotographIcon className="h-5 w-5" />}
                type="NFT"
                name="NFT Avatar"
              />
            </div>
            {settingsType === 'NFT' ? (
              <NFTPicture profile={profile} />
            ) : (
              <Picture profile={profile} />
            )}
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default ProfileSettings
