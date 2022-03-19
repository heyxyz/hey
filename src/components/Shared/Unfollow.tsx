import FollowNFT from '@abis/FollowNFT.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Profile } from '@generated/types'
import { UserRemoveIcon } from '@heroicons/react/outline'
import { Dispatch } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  FOLLOWNFT,
  WRONG_NETWORK
} from 'src/constants'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

const CREATE_UNFOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateUnfollowTypedData($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
      id
      typedData {
        value {
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

const Unfollow: React.FC<Props> = ({
  profile,
  showText = false,
  setFollowing
}) => {
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()

  const [{ loading }, write] = useContractWrite(
    {
      addressOrName: FOLLOWNFT,
      contractInterface: FollowNFT
    },
    'burn'
  )

  const [createUnfollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_UNFOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted(data: any) {
        const { tokenId } = data?.createUnfollowTypedData?.typedData?.value
        const inputArray = [tokenId]

        write({ args: inputArray }).then(({ error }) => {
          if (!error) {
            setFollowing(false)
            toast.success('Unfollowed successfully!')
          } else {
            // @ts-ignore
            toast.error(error?.data?.message)
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createUnfollow = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== 80001) {
      toast.error(WRONG_NETWORK)
    } else {
      createUnfollowTypedData({
        variables: {
          request: { profile: profile.id }
        }
      })
    }
  }

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={createUnfollow}
      disabled={typedDataLoading || loading}
      variant="danger"
      icon={
        typedDataLoading || loading ? (
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
