import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import {
  CollectModule,
  CreateCollectBroadcastItemResult
} from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { getModule } from '@lib/getModule'
import { getTokenImage } from '@lib/getTokenImage'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import React from 'react'
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
  post: LensterPost
}

const CollectModule: React.FC<Props> = ({ post }) => {
  // @ts-ignore
  const collectModule: LensterCollectModule = post?.collectModule
  const percentageCollected =
    (post?.stats?.totalAmountOfCollects /
      parseInt(collectModule?.collectLimit)) *
    100

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
                toast.success('Post has been collected!')
              } else {
                if (
                  error?.data?.message ===
                  'execution reverted: SafeERC20: low-level call failed'
                ) {
                  toast.error(
                    `Please allow ${
                      getModule(post.collectModule.type).name
                    } module in allowance settings`
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
    } else if (
      // @ts-ignore
      parseInt(post?.collectModule?.collectLimit) <=
      post?.stats?.totalAmountOfCollects
    ) {
      toast.error('Collect limit reached for this publication!')
    } else {
      createCollectTypedData({
        variables: {
          request: {
            publicationId: post.pubId
          }
        }
      })
    }
  }

  return (
    <>
      {collectModule.type === 'LimitedFeeCollectModule' ||
        (collectModule.type === 'LimitedTimedFeeCollectModule' && (
          <div className="w-full bg-gray-200 h-2.5 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2.5"
              style={{ width: `${percentageCollected}%` }}
            />
          </div>
        ))}
      <div className="p-5 space-y-1">
        <div className="space-x-1.5">
          <span>Module:</span>
          <span className="font-bold text-gray-600">
            {collectModule.__typename === 'EmptyCollectModuleSettings'
              ? 'Empty Collect'
              : getModule(collectModule.type).name}
          </span>
        </div>
        {collectModule?.recipient && (
          <div className="space-x-1.5">
            <span>Recipient:</span>
            <a
              href={`https://mumbai.polygonscan.com/address/${collectModule.recipient}`}
              target="_blank"
              className="font-bold text-gray-600"
              rel="noreferrer"
            >
              {formatUsername(collectModule.recipient)}
            </a>
          </div>
        )}
        {collectModule?.referralFee && (
          <div className="space-x-1.5">
            <span>Referral Fee:</span>
            <span className="font-bold text-gray-600">
              {collectModule.referralFee}%
            </span>
          </div>
        )}
        {collectModule?.collectLimit && (
          <div className="space-x-1.5">
            <span>Collect limit:</span>
            <span className="font-bold text-gray-600">
              {collectModule.collectLimit}
            </span>
          </div>
        )}
        {collectModule?.amount && (
          <div className="space-x-1.5 flex items-center">
            <span>Fee:</span>
            <span className="flex items-center space-x-1.5 font-bold text-gray-600">
              <span>{collectModule.amount.value}</span>
              <span>{collectModule.amount.asset.symbol}</span>
              <Tooltip content={collectModule.amount.asset.symbol}>
                <img
                  className="w-5 h-5"
                  src={getTokenImage(collectModule.amount.asset.symbol)}
                  alt={collectModule.amount.asset.symbol}
                />
              </Tooltip>
            </span>
          </div>
        )}
        {collectModule?.endTimestamp && (
          <div className="space-x-1.5">
            <span>Ends in:</span>
            <span className="font-bold text-gray-600">
              {(
                Math.abs(
                  new Date().getTime() -
                    new Date(collectModule.endTimestamp).getTime()
                ) / 36e5
              ).toFixed(1)}
            </span>
          </div>
        )}
        <div className="pt-3">
          <Button
            onClick={createCollect}
            disabled={typedDataLoading || signLoading || writeLoading}
            icon={<CollectionIcon className="w-4 h-4" />}
          >
            Collect now
          </Button>
        </div>
      </div>
    </>
  )
}

export default CollectModule
