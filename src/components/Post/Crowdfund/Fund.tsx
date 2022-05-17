import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation, useQuery } from '@apollo/client'
import { ALLOWANCE_SETTINGS_QUERY } from '@components/Settings/Allowance'
import AllowanceButton from '@components/Settings/Allowance/Button'
import Uniswap from '@components/Shared/Uniswap'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import { CreateCollectBroadcastItemResult } from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { CashIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import React, { Dispatch, FC, useContext, useState } from 'react'
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
  useBalance,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

import IndexStatus from '../../Shared/IndexStatus'

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
  fund: LensterPost
  collectModule: LensterCollectModule
  setRevenue: Dispatch<number>
  revenue: number
}

const Fund: FC<Props> = ({ fund, collectModule, setRevenue, revenue }) => {
  const { currentUser } = useContext(AppContext)
  const [allowed, setAllowed] = useState<boolean>(true)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    addressOrName: currentUser?.ownedBy,
    token: collectModule?.amount?.asset?.address
  })
  let hasAmount = false

  if (
    balanceData &&
    parseFloat(balanceData?.formatted) <
      parseFloat(collectModule?.amount?.value)
  ) {
    hasAmount = false
  } else {
    hasAmount = true
  }

  const { data: allowanceData, loading: allowanceLoading } = useQuery(
    ALLOWANCE_SETTINGS_QUERY,
    {
      variables: {
        request: {
          currencies: collectModule?.amount?.asset?.address,
          followModules: [],
          collectModules: collectModule?.type,
          referenceModules: []
        }
      },
      skip: !collectModule?.amount?.asset?.address || !currentUser,
      onCompleted(data) {
        setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00')
        consoleLog('Query', '#8b5cf6', `Fetched allowance data`)
      }
    }
  )

  const onCompleted = () => {
    setRevenue(revenue + parseFloat(collectModule?.amount?.value))
    toast.success('Transaction submitted successfully!')
    trackEvent('fund a crowdfund')
  }

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'collectWithSig',
    {
      onSuccess() {
        onCompleted()
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onCompleted() {
        onCompleted()
      },
      onError(error) {
        consoleLog('Relay Error', '#ef4444', error.message)
      }
    })
  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createCollectTypedData')
        const { id, typedData } = createCollectTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, pubId, data: collectData } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            collector: account?.address,
            profileId,
            pubId,
            data: collectData,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ errors }) => {
                if (errors) {
                  write({ args: inputStruct })
                }
              }
            )
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
        variables: { request: { publicationId: fund.id } }
      })
    }
  }

  return allowanceLoading || balanceLoading ? (
    <div className="w-24 rounded-lg h-[34px] shimmer" />
  ) : allowed ? (
    <div className="flex items-center mt-3 space-y-0 space-x-3 sm:block sm:mt-0 sm:space-y-2">
      {hasAmount ? (
        <>
          <Button
            className="sm:mt-0 sm:ml-auto"
            onClick={createCollect}
            disabled={
              !hasAmount ||
              typedDataLoading ||
              signLoading ||
              writeLoading ||
              broadcastLoading
            }
            variant="success"
            icon={
              typedDataLoading ||
              signLoading ||
              writeLoading ||
              broadcastLoading ? (
                <Spinner variant="success" size="xs" />
              ) : (
                <CashIcon className="w-4 h-4" />
              )
            }
          >
            Fund
          </Button>
          {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
            <div className="mt-2">
              <IndexStatus
                txHash={
                  writeData?.hash
                    ? writeData?.hash
                    : broadcastData?.broadcast?.txHash
                }
              />
            </div>
          ) : null}
        </>
      ) : (
        <Uniswap module={collectModule} />
      )}
    </div>
  ) : (
    <AllowanceButton
      title="Allow"
      module={allowanceData?.approvedModuleAllowanceAmount[0]}
      allowed={allowed}
      setAllowed={setAllowed}
    />
  )
}

export default Fund
