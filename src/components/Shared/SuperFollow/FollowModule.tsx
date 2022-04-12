import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation, useQuery } from '@apollo/client'
import { ALLOWANCE_SETTINGS_QUERY } from '@components/Settings/Allowance'
import AllowanceButton from '@components/Settings/Allowance/Button'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import {
  CreateFollowBroadcastItemResult,
  FeeFollowModuleSettings,
  Profile
} from '@generated/types'
import { StarIcon, UserIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import formatAddress from '@lib/formatAddress'
import getTokenImage from '@lib/getTokenImage'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import { Dispatch, FC, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  POLYGONSCAN_URL,
  WRONG_NETWORK
} from 'src/constants'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

import Slug from '../Slug'

const SUPER_FOLLOW_QUERY = gql`
  query SuperFollow($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        followModule {
          ... on FeeFollowModuleSettings {
            amount {
              asset {
                name
                symbol
                address
              }
              value
            }
            recipient
          }
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
}

const FollowModule: FC<Props> = ({
  profile,
  setFollowing,
  setShowFollowModal
}) => {
  const { currentUser } = useContext(AppContext)
  const [allowed, setAllowed] = useState<boolean>(true)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { isLoading: writeLoading, write } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'followWithSig',
    {
      onSuccess() {
        setFollowing(true)
        setShowFollowModal(false)
        toast.success('Followed successfully!')
        trackEvent('super follow user')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

  const { data, loading } = useQuery(SUPER_FOLLOW_QUERY, {
    variables: { request: { profileIds: profile?.id } },
    skip: !profile?.id,
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched super follow details Profile:${profile?.id}`
      )
    }
  })

  const followModule: FeeFollowModuleSettings =
    data?.profiles?.items[0]?.followModule

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
        consoleLog('Query', '#8b5cf6', `Fetched allowance data`)
      }
    }
  )

  const [createFollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_FOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createFollowTypedData
      }: {
        createFollowTypedData: CreateFollowBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createFollowTypedData')
        const { typedData } = createFollowTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileIds, datas: followData } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const inputStruct = {
            follower: account?.address,
            profileIds,
            datas: followData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline
            }
          }
          write({ args: inputStruct })
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createFollow = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createFollowTypedData({
        variables: {
          request: {
            follow: {
              profile: profile.id,
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
  }

  if (loading) return <div className="h-5 m-5 rounded-lg shimmer" />

  return (
    <div className="p-5">
      <div className="space-y-1.5 pb-2">
        <div className="text-lg font-bold">
          Super follow <Slug slug={profile?.handle} prefix="@" />
        </div>
        <div className="text-gray-500">Follow and get some awesome perks!</div>
      </div>
      <div className="flex items-center py-2 space-x-1.5">
        <img
          className="w-7 h-7"
          src={getTokenImage(followModule?.amount?.asset?.symbol)}
          alt={followModule?.amount?.asset?.symbol}
          title={followModule?.amount?.asset?.name}
        />
        <span className="space-x-1">
          <span className="text-2xl font-bold">
            {followModule.amount.value}
          </span>
          <span className="text-xs">{followModule?.amount?.asset?.symbol}</span>
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <UserIcon className="w-4 h-4 text-gray-500" />
        <div className="space-x-1.5">
          <span>Recipient:</span>
          <a
            href={`${POLYGONSCAN_URL}/address/${followModule.recipient}`}
            target="_blank"
            className="font-bold text-gray-600"
            rel="noreferrer"
          >
            {formatAddress(followModule.recipient)}
          </a>
        </div>
      </div>
      <div className="pt-5 space-y-2">
        <div className="text-lg font-bold">Perks you get</div>
        <ul className="text-gray-500 text-sm space-y-1">
          <li className="space-x-2 flex leading-6 tracking-normal">
            <div>•</div>
            <div>You can comment on @{profile?.handle}'s publications</div>
          </li>
          <li className="space-x-2 flex leading-6 tracking-normal">
            <div>•</div>
            <div>You can collect @{profile?.handle}'s publications</div>
          </li>
          <li className="space-x-2 flex leading-6 tracking-normal">
            <div>•</div>
            <div>
              You will get super follow badge in @{profile?.handle}'s profile
            </div>
          </li>
          <li className="space-x-2 flex leading-6 tracking-normal">
            <div>•</div>
            <div>More coming soon™</div>
          </li>
        </ul>
      </div>
      {currentUser ? (
        allowanceLoading ? (
          <div className="w-28 mt-5 rounded-lg h-[34px] shimmer" />
        ) : allowed ? (
          <Button
            className="text-sm !px-3 !py-1.5 mt-5 border-pink-500 hover:bg-pink-100 focus:ring-pink-400 !text-pink-500"
            outline
            onClick={createFollow}
            disabled={typedDataLoading || signLoading || writeLoading}
            variant="success"
            icon={
              typedDataLoading || signLoading || writeLoading ? (
                <Spinner variant="super" size="xs" />
              ) : (
                <StarIcon className="w-4 h-4" />
              )
            }
          >
            Super follow now
          </Button>
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
