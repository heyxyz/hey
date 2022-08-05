import { FollowNFT } from '@abis/FollowNFT'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { CreateUnfollowBroadcastItemResult, Profile } from '@generated/types'
import { UserRemoveIcon } from '@heroicons/react/outline'
import { Mixpanel } from '@lib/mixpanel'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import { Contract, Signer } from 'ethers'
import { Dispatch, FC, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE, SIGN_WALLET } from 'src/constants'
import { useAppPersistStore } from 'src/store/app'
import { PROFILE } from 'src/tracking'
import { useSigner, useSignTypedData } from 'wagmi'

const CREATE_UNFOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateUnfollowTypedData($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
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
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
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

const Unfollow: FC<Props> = ({
  profile,
  showText = false,
  setFollowing,
  followersCount,
  setFollowersCount
}) => {
  const { isAuthenticated } = useAppPersistStore()
  const [writeLoading, setWriteLoading] = useState<boolean>(false)
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { data: signer } = useSigner()

  const [createUnfollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_UNFOLLOW_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createUnfollowTypedData
      }: {
        createUnfollowTypedData: CreateUnfollowBroadcastItemResult
      }) {
        const { typedData } = createUnfollowTypedData
        const { deadline } = typedData?.value

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          const { tokenId } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline }
          setWriteLoading(true)
          try {
            const followNftContract = new Contract(
              typedData.domain.verifyingContract,
              FollowNFT,
              signer as Signer
            )

            const tx = await followNftContract.burnWithSig(tokenId, sig)
            if (tx) {
              if (followersCount && setFollowersCount) {
                setFollowersCount(followersCount - 1)
              }
              setFollowing(false)
            }
            toast.success('Unfollowed successfully!')
            Mixpanel.track(PROFILE.UNFOLLOW, { result: 'success' })
          } catch {
            toast.error('User rejected request')
          } finally {
            setWriteLoading(false)
          }
        } catch (error) {}
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createUnfollow = () => {
    if (!isAuthenticated) return toast.error(SIGN_WALLET)

    createUnfollowTypedData({
      variables: {
        request: { profile: profile?.id }
      }
    })
  }

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={createUnfollow}
      disabled={typedDataLoading || signLoading || writeLoading}
      variant="danger"
      aria-label="Unfollow"
      icon={
        typedDataLoading || signLoading || writeLoading ? (
          <Spinner variant="danger" size="xs" />
        ) : (
          <UserRemoveIcon className="w-4 h-4" />
        )
      }
    >
      {showText && 'Unfollow'}
    </Button>
  )
}

export default Unfollow
