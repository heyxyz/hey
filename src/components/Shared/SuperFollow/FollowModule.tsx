import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import {
  CreateFollowBroadcastItemResult,
  FeeFollowModuleSettings,
  Profile
} from '@generated/types'
import { StarIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import { Dispatch, FC } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
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
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'followWithSig'
  )

  const { data, loading } = useQuery(SUPER_FOLLOW_QUERY, {
    variables: { request: { profileIds: profile?.id } },
    skip: !profile?.id,
    onCompleted() {
      consoleLog(
        'Fetch',
        '#8b5cf6',
        `Fetched super follow details Profile:${profile?.id}`
      )
    }
  })

  const followModule: FeeFollowModuleSettings =
    data?.profiles?.items[0]?.followModule

  const [createFollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_FOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createFollowTypedData
      }: {
        createFollowTypedData: CreateFollowBroadcastItemResult
      }) {
        const { typedData } = createFollowTypedData
        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { profileIds, datas: followData } = typedData?.value
            const { v, r, s } = splitSignature(res.data)
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

            write({ args: inputStruct }).then(({ error }) => {
              if (!error) {
                setFollowing(true)
                setShowFollowModal(false)
                toast.success('Followed successfully!')
                trackEvent('super follow user')
              } else {
                toast.error(error?.message)
              }
            })
          } else {
            toast.error(res.error?.message)
          }
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
    } else if (network.chain?.id !== CHAIN_ID) {
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
    <div className="p-5 space-y-3">
      <div className="text-lg font-bold">
        Super Follow <Slug slug={profile?.handle} prefix="@" />
      </div>
      <Button
        className="text-sm !px-3 !py-1.5 border-pink-500 hover:bg-pink-100 focus:ring-pink-400 !text-pink-500"
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
        Super Follow
      </Button>
    </div>
  )
}

export default FollowModule
