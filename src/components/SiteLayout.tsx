import { gql, useQuery } from '@apollo/client'
import { Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import consoleLog from '@lib/consoleLog'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { FC, ReactNode, Suspense, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import useAppStore from 'src/store'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import Loading from './Loading'

const Navbar = dynamic(() => import('./Shared/Navbar'), { suspense: true })

export const CURRENT_USER_QUERY = gql`
  query CurrentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...MinimalProfileFields
        isDefault
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  children: ReactNode
}

const SiteLayout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme()
  const { currentUser, setProfiles, setUserSigNonce } = useAppStore()
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [refreshToken, setRefreshToken] = useState<string>()
  const { data: accountData } = useAccount()
  const { activeConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: accountData?.address },
    skip: !currentUser || !refreshToken,
    onCompleted(data) {
      const profiles: Profile[] = data?.profiles?.items
        ?.slice()
        ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
        ?.sort((a: Profile, b: Profile) =>
          !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
        )
      setProfiles(profiles)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)

      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched ${data?.profiles?.items?.length} owned profiles`
      )
    }
  })

  useEffect(() => {
    setRefreshToken(Cookies.get('refreshToken'))
    setPageLoading(false)

    if (!activeConnector) {
      disconnect()
    }

    activeConnector?.on('change', () => {
      localStorage.removeItem('lenster.store')
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      location.href = '/'
    })
  }, [activeConnector, disconnect])

  const toastOptions = {
    style: {
      background: resolvedTheme === 'dark' ? '#18181B' : '',
      color: resolvedTheme === 'dark' ? '#fff' : ''
    },
    success: {
      className: 'border border-green-500',
      iconTheme: {
        primary: '#10B981',
        secondary: 'white'
      }
    },
    error: {
      className: 'border border-red-500',
      iconTheme: {
        primary: '#EF4444',
        secondary: 'white'
      }
    },
    loading: { className: 'border border-gray-300' }
  }

  if (loading || pageLoading) return <Loading />

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {children}
        </div>
      </Suspense>
    </>
  )
}

export default SiteLayout
