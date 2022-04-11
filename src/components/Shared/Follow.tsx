import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { CreateFollowBroadcastItemResult, Profile } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
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

const Follow: FC<Props> = ({ profile, showText = false, setFollowing }) => {
  const { data: network } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData()
  const { isLoading: writeLoading, writeAsync } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'followWithSig'
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

            writeAsync({ args: inputStruct }).then(({ error }) => {
              if (!error) {
                setFollowing(true)
                toast.success('Followed successfully!')
                trackEvent('follow user')
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
    } else if (network?.id !== CHAIN_ID) {
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
      disabled={typedDataLoading || signLoading || writeLoading}
      variant="success"
      icon={
        typedDataLoading || signLoading || writeLoading ? (
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
