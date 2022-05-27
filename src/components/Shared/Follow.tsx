import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { CreateFollowBroadcastItemResult, Profile } from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { UserAddIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import { Dispatch, FC, useContext } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  RELAY_ON,
  SELF_FOLLOW,
  WRONG_NETWORK
} from 'src/constants'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

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
  followersCount?: number
  setFollowersCount?: Dispatch<number>
  showText?: boolean
}

const Follow: FC<Props> = ({
  profile,
  showText = false,
  setFollowing,
  followersCount,
  setFollowersCount
}) => {
  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
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
    toast.success('Followed successfully!')
    trackEvent('follow user')
  }

  const { isLoading: writeLoading, write } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'followWithSig',
    {
      onSuccess() {
        onCompleted()
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const [broadcast, { loading: broadcastLoading }] = useMutation(
    BROADCAST_MUTATION,
    {
      onCompleted({ broadcast }) {
        if (broadcast?.reason !== 'NOT_ALLOWED') {
          onCompleted()
        }
      },
      onError(error) {
        consoleLog('Relay Error', '#ef4444', error.message)
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
        const { id, typedData } = createFollowTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileIds, datas: followData } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            follower: account?.address,
            profileIds,
            datas: followData,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ data: { broadcast }, errors }) => {
                if (errors || broadcast?.reason === 'NOT_ALLOWED') {
                  write({ args: inputStruct })
                }
              }
            )
          } else {
            write({ args: inputStruct })
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createFollow = () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else if (currentUser?.id === profile?.id) {
      toast.error(SELF_FOLLOW)
    } else {
      createFollowTypedData({
        variables: {
          request: {
            follow: {
              profile: profile?.id,
              followModule:
                profile?.followModule?.__typename ===
                'ProfileFollowModuleSettings'
                  ? { profileFollowModule: { profileId: currentUser?.id } }
                  : null
            }
          }
        }
      })
    }
  }

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={createFollow}
      disabled={
        typedDataLoading || signLoading || writeLoading || broadcastLoading
      }
      variant="success"
      aria-label="Follow"
      icon={
        typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
          <Spinner variant="success" size="xs" />
        ) : (
          <UserAddIcon className="w-4 h-4" />
        )
      }
    >
      {showText && 'Follow'}
    </Button>
  )
}

export default Follow
