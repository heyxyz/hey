import FollowNFT from '@abis/FollowNFT.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Profile } from '@generated/types'
import { UserRemoveIcon } from '@heroicons/react/outline'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { Dispatch } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  FOLLOW_NFT,
  WRONG_NETWORK
} from 'src/constants'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

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

const Unfollow: React.FC<Props> = ({
  profile,
  showText = false,
  setFollowing
}) => {
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: FOLLOW_NFT,
      contractInterface: FollowNFT
    },
    'burnWithSig'
  )

  const [createUnfollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_UNFOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted({ createUnfollowTypedData }: any) {
        const { typedData } = createUnfollowTypedData

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { tokenId } = typedData?.value
            const { v, r, s } = splitSignature(res.data)
            const inputArray = [
              tokenId,
              {
                v,
                r,
                s,
                deadline: typedData.value.deadline
              }
            ]

            write({ args: inputArray }).then(({ error }: { error: any }) => {
              if (!error) {
                setFollowing(false)
                toast.success('Unfollowed successfully!')
              } else {
                toast.error(error?.data?.message)
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
      disabled={typedDataLoading || signLoading || writeLoading}
      variant="danger"
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
