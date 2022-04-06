import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import AppContext from '@components/utils/AppContext'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import { CreateCollectBroadcastItemResult } from '@generated/types'
import {
  CashIcon,
  ClockIcon,
  CollectionIcon,
  PhotographIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { getModule } from '@lib/getModule'
import { getTokenImage } from '@lib/getTokenImage'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { trackEvent } from '@lib/trackEvent'
import dayjs from 'dayjs'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  POLYGONSCAN_URL,
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
  post: LensterPost
}

const CollectModule: React.FC<Props> = ({ post }) => {
  const { currentUser } = useContext(AppContext)
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
                trackEvent('collect publication')
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
    } else if (network.chain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else if (
      // @ts-ignore
      parseInt(post?.collectModule?.collectLimit) <=
      post?.stats?.totalAmountOfCollects
    ) {
      toast.error('Collect limit reached for this publication!')
    } else {
      createCollectTypedData({
        variables: { request: { publicationId: post.id } }
      })
    }
  }

  return (
    <>
      {collectModule.type === 'LimitedFeeCollectModule' ||
        (collectModule.type === 'LimitedTimedFeeCollectModule' && (
          <Tooltip content="Collect Limit">
            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2.5 bg-brand-500"
                style={{ width: `${percentageCollected}%` }}
              />
            </div>
          </Tooltip>
        ))}
      <div className="p-5 space-y-3">
        <div className="space-y-1.5">
          <div className="space-y-1.5">
            {post?.metadata?.name && (
              <div className="text-xl font-bold">{post?.metadata?.name}</div>
            )}
            {post?.metadata?.description && (
              <div className="text-gray-500 line-clamp-2">
                {post?.metadata?.description}
              </div>
            )}
          </div>
          {collectModule?.amount && (
            <div className="flex items-center py-2 space-x-1.5">
              <span className="flex items-center space-x-1.5">
                <Tooltip content={collectModule.amount.asset.symbol}>
                  <img
                    className="w-7 h-7"
                    src={getTokenImage(collectModule.amount.asset.symbol)}
                    alt={collectModule.amount.asset.symbol}
                  />
                </Tooltip>
                <span className="space-x-1">
                  <span className="text-2xl font-bold">
                    {collectModule.amount.value}
                  </span>
                  <span className="text-xs">
                    {collectModule.amount.asset.symbol}
                  </span>
                </span>
              </span>
            </div>
          )}
          <div className="block space-y-1 sm:flex sm:space-x-5 item-center">
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              <div className="font-bold">
                {post?.stats?.totalAmountOfCollects} collectors
              </div>
            </div>
            {collectModule?.collectLimit && (
              <div className="flex items-center space-x-2">
                <PhotographIcon className="w-4 h-4 text-gray-500" />
                <div className="font-bold">
                  {parseInt(collectModule?.collectLimit) -
                    post?.stats?.totalAmountOfCollects}{' '}
                  available
                </div>
              </div>
            )}
            {collectModule?.referralFee ? (
              <div className="flex items-center space-x-2">
                <CashIcon className="w-4 h-4 text-gray-500" />
                <div className="font-bold">
                  {collectModule.referralFee}% referral fee
                </div>
              </div>
            ) : null}
          </div>
          <div>
            {collectModule?.endTimestamp && (
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                <div className="space-x-1.5">
                  <span>Sale Ends</span>
                  <span className="font-bold text-gray-600">
                    {dayjs(collectModule.endTimestamp).format('MMMM DD, YYYY')}{' '}
                    at {dayjs(collectModule.endTimestamp).format('hh:mm a')}
                  </span>
                </div>
              </div>
            )}
          </div>
          {collectModule?.recipient && (
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <div className="space-x-1.5">
                <span>Recipient:</span>
                <a
                  href={`${POLYGONSCAN_URL}/address/${collectModule.recipient}`}
                  target="_blank"
                  className="font-bold text-gray-600"
                  rel="noreferrer"
                >
                  {formatUsername(collectModule.recipient)}
                </a>
              </div>
            </div>
          )}
        </div>
        {currentUser && (
          <div className="pt-2">
            <Button
              onClick={createCollect}
              disabled={typedDataLoading || signLoading || writeLoading}
              icon={
                typedDataLoading || signLoading || writeLoading ? (
                  <Spinner size="xs" />
                ) : (
                  <CollectionIcon className="w-4 h-4" />
                )
              }
            >
              Collect now
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default CollectModule
