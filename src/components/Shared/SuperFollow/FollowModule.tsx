import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation, useQuery } from '@apollo/client'
import { ALLOWANCE_SETTINGS_QUERY } from '@components/Settings/Allowance'
import AllowanceButton from '@components/Settings/Allowance/Button'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { WarningMessage } from '@components/UI/WarningMessage'
import { LensterFollowModule } from '@generated/lenstertypes'
import {
  CreateFollowBroadcastItemResult,
  FeeFollowModuleSettings,
  Profile
} from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { StarIcon, UserIcon } from '@heroicons/react/outline'
import formatAddress from '@lib/formatAddress'
import getTokenImage from '@lib/getTokenImage'
import Logger from '@lib/logger'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import { Dispatch, FC, useState } from 'react'
import toast from 'react-hot-toast'
import {
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  POLYGONSCAN_URL,
  RELAY_ON,
  SIGN_WALLET
} from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import {
  useAccount,
  useBalance,
  useContractWrite,
  useSignTypedData
} from 'wagmi'

import Loader from '../Loader'
import Slug from '../Slug'
import Uniswap from '../Uniswap'

const SUPER_FOLLOW_QUERY = gql`
  query SuperFollow($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      id
      followModule {
        ... on FeeFollowModuleSettings {
          amount {
            asset {
              name
              symbol
              decimals
              address
            }
            value
          }
          recipient
        }
      }
    }
  }
`

const CREATE_FOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateFollowTypedData($request: FollowRequest!) {
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`

interface Props {
  profile: Profile
  setFollowing: Dispatch<boolean>
  setShowFollowModal: Dispatch<boolean>
  followersCount?: number
  setFollowersCount?: Dispatch<number>
  again: boolean
}

const FollowModule: FC<Props> = ({
  profile,
  setFollowing,
  setShowFollowModal,
  followersCount,
  setFollowersCount,
  again
}) => {
  const { userSigNonce, setUserSigNonce } = useAppStore()
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const [allowed, setAllowed] = useState<boolean>(true)
  const { address } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const onCompleted = () => {
    if (followersCount && setFollowersCount) {
      setFollowersCount(followersCount + 1)
    }
    setFollowing(true)
    setShowFollowModal(false)
    toast.success('Followed successfully!')
  }

  const { isLoading: writeLoading, write } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'followWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess() {
      onCompleted()
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const { data, loading } = useQuery(SUPER_FOLLOW_QUERY, {
    variables: { request: { profileId: profile?.id } },
    skip: !profile?.id,
    onCompleted() {
      Logger.log(
        '[Query]',
        `Fetched super follow details Profile:${profile?.id}`
      )
    }
  })

  const followModule: FeeFollowModuleSettings = data?.profile?.followModule

  const { data: allowanceData, loading: allowanceLoading } = useQuery(
    ALLOWANCE_SETTINGS_QUERY,
    {
      variables: {
        request: {
          currencies: followModule?.amount?.asset?.address,
          followModules: 'FeeFollowModule',
          collectModules: [],
          referenceModules: []
        }
      },
      skip: !followModule?.amount?.asset?.address || !currentUser,
      onCompleted(data) {
        setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00')
        Logger.log('[Query]', `Fetched allowance data`)
      }
    }
  )

  const { data: balanceData } = useBalance({
    addressOrName: currentUser?.ownedBy,
    token: followModule?.amount?.asset?.address,
    formatUnits: followModule?.amount?.asset?.decimals,
    watch: true
  })
  let hasAmount = false

  if (
    balanceData &&
    parseFloat(balanceData?.formatted) < parseFloat(followModule?.amount?.value)
  ) {
    hasAmount = false
  } else {
    hasAmount = true
  }

  const [broadcast, { loading: broadcastLoading }] = useMutation(
    BROADCAST_MUTATION,
    {
      onCompleted,
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        Logger.error('[Relay Error]', error.message)
      }
    }
  )
  const [createFollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_FOLLOW_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createFollowTypedData
      }: {
        createFollowTypedData: CreateFollowBroadcastItemResult
      }) {
        Logger.log('[Mutation]', 'Generated createFollowTypedData')
        const { id, typedData } = createFollowTypedData
        const { deadline } = typedData?.value

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          setUserSigNonce(userSigNonce + 1)
          const { profileIds, datas: followData } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline }
          const inputStruct = {
            follower: address,
            profileIds,
            datas: followData,
            sig
          }
          if (RELAY_ON) {
            const {
              data: { broadcast: result },
              errors
            } = await broadcast({ variables: { request: { id, signature } } })

            if ('reason' in result || errors)
              write?.({ recklesslySetUnpreparedArgs: inputStruct })
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct })
          }
        } catch (error) {
          Logger.warn('[Sign Error]', error)
        }
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createFollow = () => {
    if (!isAuthenticated) return toast.error(SIGN_WALLET)

    createFollowTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: {
            profile: profile?.id,
            followModule: {
              feeFollowModule: {
                amount: {
                  currency: followModule?.amount?.asset?.address,
                  value: followModule?.amount?.value
                }
              }
            }
          }
        }
      }
    })
  }

  if (loading) return <Loader message="Loading super follow" />

  return (
    <div className="p-5">
      <div className="pb-2 space-y-1.5">
        <div className="text-lg font-bold">
          Super follow <Slug slug={profile?.handle} prefix="@" />{' '}
          {again ? 'again' : ''}
        </div>
        <div className="text-gray-500">
          Follow {again ? 'again' : ''} and get some awesome perks!
        </div>
      </div>
      <div className="flex items-center py-2 space-x-1.5">
        <img
          className="w-7 h-7"
          height={28}
          width={28}
          src={getTokenImage(followModule?.amount?.asset?.symbol)}
          alt={followModule?.amount?.asset?.symbol}
          title={followModule?.amount?.asset?.name}
        />
        <span className="space-x-1">
          <span className="text-2xl font-bold">
            {followModule?.amount?.value}
          </span>
          <span className="text-xs">{followModule?.amount?.asset?.symbol}</span>
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <UserIcon className="w-4 h-4 text-gray-500" />
        <div className="space-x-1.5">
          <span>Recipient:</span>
          <a
            href={`${POLYGONSCAN_URL}/address/${followModule?.recipient}`}
            target="_blank"
            className="font-bold text-gray-600"
            rel="noreferrer noopener"
          >
            {formatAddress(followModule?.recipient)}
          </a>
        </div>
      </div>
      <div className="pt-5 space-y-2">
        <div className="text-lg font-bold">Perks you get</div>
        <ul className="space-y-1 text-sm text-gray-500">
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>
              You can comment on @{profile?.handle}&rsquo;s publications
            </div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>You can collect @{profile?.handle}&rsquo;s publications</div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>
              You will get super follow badge in @{profile?.handle}&rsquo;s
              profile
            </div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>
              You will have high voting power if you followed multiple times
            </div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>More coming soon™</div>
          </li>
        </ul>
      </div>
      {currentUser ? (
        allowanceLoading ? (
          <div className="mt-5 w-28 rounded-lg h-[34px] shimmer" />
        ) : allowed ? (
          hasAmount ? (
            <Button
              className="text-sm !px-3 !py-1.5 mt-5"
              variant="super"
              outline
              onClick={createFollow}
              disabled={
                typedDataLoading ||
                signLoading ||
                writeLoading ||
                broadcastLoading
              }
              icon={
                typedDataLoading ||
                signLoading ||
                writeLoading ||
                broadcastLoading ? (
                  <Spinner variant="super" size="xs" />
                ) : (
                  <StarIcon className="w-4 h-4" />
                )
              }
            >
              Super follow {again ? 'again' : 'now'}
            </Button>
          ) : (
            <WarningMessage
              className="mt-5"
              message={<Uniswap module={followModule as LensterFollowModule} />}
            />
          )
        ) : (
          <div className="mt-5">
            <AllowanceButton
              title="Allow follow module"
              module={allowanceData?.approvedModuleAllowanceAmount[0]}
              allowed={allowed}
              setAllowed={setAllowed}
            />
          </div>
        )
      ) : null}
    </div>
  )
}

export default FollowModule
