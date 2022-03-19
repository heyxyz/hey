import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Profile } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
import { Dispatch } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

const CREATE_FOLLOW_TYPED_DATA_MUTATION = gql`
  mutation CreateFollowTypedData($request: FollowRequest!) {
    createFollowTypedData(request: $request) {
      id
      typedData {
        value {
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

  const [{ loading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'follow'
  )

  const [createFollowTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_FOLLOW_TYPED_DATA_MUTATION,
    {
      onCompleted(data: any) {
        const { profileIds, datas: followData } =
          data?.createFollowTypedData?.typedData?.value
        const inputArray = [profileIds, followData]

        write({ args: inputArray }).then(({ error }) => {
          if (!error) {
            setFollowing(true)
            toast.success('Followed successfully!')
          } else {
            // @ts-ignore
            toast.error(error?.data?.message)
          }
        })
      },
      onError() {
        toast.error(ERROR_MESSAGE)
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
      disabled={typedDataLoading || loading}
      variant="success"
      icon={
        typedDataLoading || loading ? (
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
