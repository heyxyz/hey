import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Community } from '@generated/lenstertypes'
import { CreateCollectBroadcastItemResult } from '@generated/types'
import { PlusIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import React, { Dispatch, FC } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  RELAY_ON,
  WRONG_NETWORK
} from 'src/constants'
import {
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
  showJoin?: boolean
}

const Join: FC<Props> = ({ community, setJoined, showJoin = true }) => {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { isLoading: writeLoading, write } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'collectWithSig',
    {
      onSuccess() {
        setJoined(true)
        toast.success('Joined successfully!')
        trackEvent('join community')
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createCollectTypedData')
        const { typedData } = createCollectTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, pubId, data: collectData } = typedData?.value
          const { v, r, s } = splitSignature(signature)
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
          if (RELAY_ON) {
            toast.success('Relay WIP')
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

  const createCollect = () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createCollectTypedData({
        variables: { request: { publicationId: community.id } }
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
      {showJoin && 'Join'}
    </Button>
  )
}

export default Join
