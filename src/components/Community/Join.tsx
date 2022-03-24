import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Community } from '@generated/lenstertypes'
import { CreateCollectBroadcastItemResult } from '@generated/types'
import { PlusIcon } from '@heroicons/react/outline'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import React, { Dispatch } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import {
  chain,
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

const CREATE_COLLECT_TYPED_DATA_MUTATION = gql`
  mutation CreateCollectTypedData($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`

interface Props {
  community: Community
  setJoined: Dispatch<boolean>
}

const Join: React.FC<Props> = ({ community, setJoined }) => {
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'collectWithSig'
  )

  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult
      }) {
        const { typedData } = createCollectTypedData

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { profileId, pubId, data: collectData } = typedData?.value
            const { v, r, s } = splitSignature(res.data)
            const inputStruct = {
              collector: account?.address,
              profileId,
              pubId,
              data: collectData,
              sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline
              }
            }

            write({ args: inputStruct }).then(({ error }: { error: any }) => {
              if (!error) {
                setJoined(true)
                toast.success('Joined successfully!')
              } else {
                if (
                  error?.data?.message ===
                  'execution reverted: SafeERC20: low-level call failed'
                ) {
                  toast.error(
                    `Please allow Empty Collect module in allowance settings`
                  )
                } else {
                  toast.error(error?.data?.message)
                }
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

  const createCollect = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== chain.polygonTestnetMumbai.id) {
      toast.error(WRONG_NETWORK)
    } else {
      createCollectTypedData({
        variables: {
          request: {
            publicationId: community.pubId
          }
        }
      })
    }
  }

  return (
    <Button
      onClick={createCollect}
      disabled={typedDataLoading || signLoading || writeLoading}
      icon={
        typedDataLoading || signLoading || writeLoading ? (
          <Spinner variant="success" size="xs" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )
      }
      variant="success"
      outline
    >
      Join
    </Button>
  )
}

export default Join
