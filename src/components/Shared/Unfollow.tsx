import FollowNFT from '@abis/FollowNFT.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { CreateUnfollowBroadcastItemResult, Profile } from '@generated/types'
import { UserRemoveIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import { Contract, Signer } from 'ethers'
import { Dispatch, FC, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  WRONG_NETWORK
} from 'src/constants'
import { useAccount, useNetwork, useSigner, useSignTypedData } from 'wagmi'

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
  showText?: boolean
  setFollowing: Dispatch<boolean>
}

const Unfollow: FC<Props> = ({ profile, showText = false, setFollowing }) => {
  const [writeLoading, setWriteLoading] = useState<boolean>(false)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { data: signer } = useSigner()

  const [createUnfollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_UNFOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createUnfollowTypedData
      }: {
        createUnfollowTypedData: CreateUnfollowBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createUnfollowTypedData')
        const { typedData } = createUnfollowTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then(async (res) => {
          const { tokenId } = typedData?.value
          const { v, r, s } = splitSignature(res)
          const sig = {
            v,
            r,
            s,
            deadline: typedData.value.deadline
          }
          setWriteLoading(true)
          try {
            const followNftContract = new Contract(
              typedData.domain.verifyingContract,
              FollowNFT,
              signer as Signer
            )

            const tx = await followNftContract.burnWithSig(tokenId, sig)
            if (tx) {
              setFollowing(false)
            }
            toast.success('Unfollowed successfully!')
            trackEvent('unfollow user')
          } catch {
            toast.error('User rejected request')
          } finally {
            setWriteLoading(false)
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createUnfollow = () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createUnfollowTypedData({
        variables: {
          request: { profile: profile?.id }
        }
      })
    }
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
