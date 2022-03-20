import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { CURRENT_USER_QUERY } from '@components/SiteLayout'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { XCircleIcon } from '@heroicons/react/solid'
import { getWalletLogo } from '@lib/getWalletLogo'
import clsx from 'clsx'
import React, { Dispatch, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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

const WalletSelector: React.FC<Props> = ({
  setHasConnected,
  setHasProfile
}) => {
  const [mounted, setMounted] = useState(false)
  const [loadingSign, setLoadingSign] = useState<boolean>(false)
  const [{}, signMessage] = useSignMessage()
  const [loadChallenge, { error: errorChallenege }] =
    useLazyQuery(CHALLENGE_QUERY)
  const [authenticate, { error: errorAuthenticate }] = useMutation(
    AUTHENTICATE_MUTATION
  )
  const [getProfiles, { error: errorProfiles }] =
    useLazyQuery(CURRENT_USER_QUERY)

  useEffect(() => setMounted(true), [])

  const [
    {
      data: { connector, connectors },
      loading,
      error
    },
    connect
  ] = useConnect()
  const [{ data: accountData }] = useAccount()
  const { setSelectedProfile } = useContext(AppContext)

  const onConnect = async (x: Connector) => {
    await connect(x).then(({ error }) => {
      if (!error) {
        setHasConnected(true)
      }
    })
  }

  const handleSign = () => {
    setLoadingSign(true)
    loadChallenge({
      variables: { request: { address: accountData?.address } }
    })
      .then((res) => {
        signMessage({ message: res.data.challenge.text }).then((res) => {
          if (!res.error) {
            authenticate({
              variables: {
                request: { address: accountData?.address, signature: res.data }
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
          } else {
            toast.error('User denied message signature.')
          }
        })
      })
      .finally(() => setLoadingSign(false))
  }

  return (
    <>
      {accountData?.connector?.id ? (
        <div className="space-y-3">
          <Button
            size="lg"
            icon={
              loadingSign ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : (
                <img
                  className="h-5 mr-1"
                  src="/eth-white.svg"
                  alt="Ethereum Logo"
                />
              )
            }
            onClick={handleSign}
          >
            Sign-In with Ethereum
          </Button>
          {errorChallenege ||
            errorAuthenticate ||
            (errorProfiles && (
              <div className="flex items-center space-x-1 font-bold text-red-500">
                <XCircleIcon className="w-5 h-5" />
                <div>{ERROR_MESSAGE}</div>
              </div>
            ))}
        </div>
      ) : (
        <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle transition-all transform">
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
                <span className="flex items-center justify-between w-full">
                  {mounted ? x.name : x.id === 'injected' ? x.id : x.name}
                  {mounted ? !x.ready && ' (unsupported)' : ''}
                  {loading && x.name === connector?.name && (
                    <Spinner size="sm" />
                  )}
                  {!loading && x.id === accountData?.connector?.id && (
                    <CheckCircleIcon className="w-5 h-5 text-brand-500" />
                  )}
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
