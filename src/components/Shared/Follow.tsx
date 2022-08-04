import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { CreateFollowBroadcastItemResult, Profile } from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { UserAddIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import { Mixpanel } from '@lib/mixpanel'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import { Dispatch, FC } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON
} from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

const CREATE_FOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateFollowTypedData(
    $options: TypedDataOptions
    $request: FollowRequest!
  ) {
    createFollowTypedData(options: $options, request: $request) {
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
  const { userSigNonce, setUserSigNonce } = useAppStore()
  const { isConnected, currentUser } = useAppPersistStore()
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
    toast.success('Followed successfully!')
    Mixpanel.track('profile.follow', { result: 'success' })
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

  const [broadcast, { loading: broadcastLoading }] = useMutation(
    BROADCAST_MUTATION,
    {
      onCompleted,
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        Logger.error('[Broadcast Error]', error)
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
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } })

            if ('reason' in result)
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
        Logger.error('[Typed-data Generate Error]', error)
      }
    }
  )

  const createFollow = () => {
    if (!isConnected) return toast.error(CONNECT_WALLET)

    createFollowTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
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
