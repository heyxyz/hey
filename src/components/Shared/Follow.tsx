import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Profile } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { Dispatch } from 'react'
import toast from 'react-hot-toast'
import {
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
  showText?: boolean
  setFollowing: Dispatch<boolean>
}

const Follow: React.FC<Props> = ({
  profile,
  showText = false,
  setFollowing
}) => {
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()

  const [{ loading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'followWithSig'
  )

  const [createFollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_FOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted({ createFollowTypedData }: any) {
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
                toast.success('Followed successfully!')
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
    } else if (network.chain?.id !== 80001) {
      toast.error(WRONG_NETWORK)
    } else {
      createFollowTypedData({
        variables: {
          request: { follow: { profile: profile.id } }
        }
      })
    }
  }

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={createFollow}
      disabled={typedDataLoading || signLoading || loading}
      variant="success"
      icon={
        typedDataLoading || signLoading || loading ? (
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
