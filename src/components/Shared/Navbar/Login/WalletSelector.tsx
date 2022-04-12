import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { CURRENT_USER_QUERY } from '@components/SiteLayout'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { XCircleIcon } from '@heroicons/react/solid'
import consoleLog from '@lib/consoleLog'
import getWalletLogo from '@lib/getWalletLogo'
import trackEvent from '@lib/trackEvent'
import clsx from 'clsx'
import React, { Dispatch, FC, useContext, useEffect, useState } from 'react'
import { ERROR_MESSAGE } from 'src/constants'
import { Connector, useAccount, useConnect, useSignMessage } from 'wagmi'

const CHALLENGE_QUERY = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`

export const AUTHENTICATE_MUTATION = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`

interface Props {
  setHasConnected: Dispatch<boolean>
  setHasProfile: Dispatch<boolean>
}

const WalletSelector: FC<Props> = ({ setHasConnected, setHasProfile }) => {
  const [mounted, setMounted] = useState(false)
  const { signMessageAsync, isLoading: signLoading } = useSignMessage()
  const [
    loadChallenge,
    { error: errorChallenege, loading: challenegeLoading }
  ] = useLazyQuery(CHALLENGE_QUERY, {
    onCompleted(data) {
      consoleLog(
        'Lazy Query',
        '#8b5cf6',
        `Fetched auth challenege - ${data?.challenge?.text}`
      )
    }
  })
  const [authenticate, { error: errorAuthenticate, loading: authLoading }] =
    useMutation(AUTHENTICATE_MUTATION)
  const [getProfiles, { error: errorProfiles, loading: profilesLoading }] =
    useLazyQuery(CURRENT_USER_QUERY, {
      onCompleted(data) {
        consoleLog(
          'Lazy Query',
          '#8b5cf6',
          `Fetched ${data?.profiles?.items?.length} user profiles for auth`
        )
      }
    })

  useEffect(() => setMounted(true), [])

  const { connectors, error, connectAsync } = useConnect()
  const { data: accountData } = useAccount()
  const { setSelectedProfile } = useContext(AppContext)

  const onConnect = async (x: Connector) => {
    trackEvent(`connect with ${x.name.toLowerCase()}`)
    await connectAsync(x).then(({ account }) => {
      if (account) {
        setHasConnected(true)
      }
    })
  }

  const handleSign = () => {
    trackEvent('sign in with ethereum')
    loadChallenge({
      variables: { request: { address: accountData?.address } }
    }).then((res) => {
      signMessageAsync({ message: res.data.challenge.text }).then(
        (signature) => {
          authenticate({
            variables: {
              request: { address: accountData?.address, signature }
            }
          }).then((res) => {
            localStorage.setItem(
              'accessToken',
              res.data.authenticate.accessToken
            )
            localStorage.setItem(
              'refreshToken',
              res.data.authenticate.refreshToken
            )
            getProfiles({
              variables: { ownedBy: accountData?.address }
            }).then((res) => {
              localStorage.setItem('selectedProfile', '0')
              if (res.data.profiles.items.length === 0) {
                setHasProfile(false)
              } else {
                setSelectedProfile(0)
              }
            })
          })
        }
      )
    })
  }

  return (
    <>
      {accountData?.connector?.id ? (
        <div className="space-y-3">
          <Button
            size="lg"
            disabled={
              signLoading || challenegeLoading || authLoading || profilesLoading
            }
            icon={
              signLoading ||
              challenegeLoading ||
              authLoading ||
              profilesLoading ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : (
                <img
                  className="mr-1 h-5"
                  src="/eth-white.svg"
                  alt="Ethereum Logo"
                />
              )
            }
            onClick={handleSign}
          >
            Sign-In with Ethereum
          </Button>
          {(errorChallenege || errorAuthenticate || errorProfiles) && (
            <div className="flex items-center space-x-1 font-bold text-red-500">
              <XCircleIcon className="w-5 h-5" />
              <div>{ERROR_MESSAGE}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="inline-block overflow-hidden space-y-3 w-full text-left align-middle transition-all transform">
          {connectors.map((x, i) => {
            return (
              <button
                key={i}
                className={clsx(
                  { 'hover:bg-gray-100': x.id !== accountData?.connector?.id },
                  'w-full flex items-center space-x-2.5 justify-center px-4 py-3 overflow-hidden rounded-xl border outline-none border-gray-200'
                )}
                onClick={() => onConnect(x)}
                disabled={
                  mounted
                    ? !x.ready || x.id === accountData?.connector?.id
                    : false
                }
              >
                <img
                  src={getWalletLogo(x.name)}
                  draggable={false}
                  className="w-6 h-6"
                  alt={x.name}
                />
                <span className="flex justify-between items-center w-full">
                  {mounted ? x.name : x.id === 'injected' ? x.id : x.name}
                  {mounted ? !x.ready && ' (unsupported)' : ''}
                </span>
              </button>
            )
          })}
          {error?.message ? (
            <div className="flex items-center space-x-1 text-red-500">
              <XCircleIcon className="w-5 h-5" />
              <div>{error?.message ?? 'Failed to connect'}</div>
            </div>
          ) : null}
        </div>
      )}
    </>
  )
}

export default WalletSelector
