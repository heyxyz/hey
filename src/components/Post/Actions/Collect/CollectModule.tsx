import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation, useQuery } from '@apollo/client'
import ReferenceAlert from '@components/Comment/ReferenceAlert'
import { ALLOWANCE_SETTINGS_QUERY } from '@components/Settings/Allowance'
import AllowanceButton from '@components/Settings/Allowance/Button'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { CreateCollectBroadcastItemResult } from '@generated/types'
import { CollectModuleFields } from '@gql/CollectModuleFields'
import {
  CashIcon,
  ClockIcon,
  CollectionIcon,
  PhotographIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import formatAddress from '@lib/formatAddress'
import { getModule } from '@lib/getModule'
import getTokenImage from '@lib/getTokenImage'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import dayjs from 'dayjs'
import React, { FC, useContext, useState } from 'react'
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

export const COLLECT_QUERY = gql`
  query CollectModule($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        collectModule {
          ...CollectModuleFields
        }
      }
      ... on Comment {
        collectModule {
          ...CollectModuleFields
        }
      }
    }
  }
  ${CollectModuleFields}
`

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

const CollectModule: FC<Props> = ({ post }) => {
  const { currentUser } = useContext(AppContext)
  const [allowed, setAllowed] = useState<boolean>(true)

  const { data: network } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedData } = useSignTypedData()
  const { isLoading: writeLoading, write } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'collectWithSig'
  )

  const { data, loading } = useQuery(COLLECT_QUERY, {
    variables: { request: { publicationId: post?.id } },
    skip: !post?.id,
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched collect module details Publication:${post?.id}`
      )
    }
  })

  // @ts-ignore
  const collectModule: LensterCollectModule = data?.publication?.collectModule
  const percentageCollected =
    (post?.stats?.totalAmountOfCollects /
      parseInt(collectModule?.collectLimit)) *
    100

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
        setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance === '0x00')
        consoleLog('Query', '#8b5cf6', `Fetched allowance data`)
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
                      getModule(collectModule.type).name
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
      parseInt(collectModule?.collectLimit) <=
      post?.stats?.totalAmountOfCollects
    ) {
      toast.error('Collect limit reached for this publication!')
    } else {
      createCollectTypedData({
        variables: { request: { publicationId: post.id } }
      })
    }
  }

  if (loading) return <div className="h-5 m-5 rounded-lg shimmer" />

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
      <div className="p-5">
        {collectModule?.followerOnly && (
          <div className="pb-5">
            <ReferenceAlert
              handle={post?.profile?.handle}
              isSuperFollow={post?.profile?.followModule ? true : false}
              action="collect"
            />
          </div>
        )}
        <div className="space-y-1.5 pb-2">
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
            <img
              className="w-7 h-7"
              src={getTokenImage(collectModule?.amount?.asset?.symbol)}
              alt={collectModule?.amount?.asset?.symbol}
              title={collectModule?.amount?.asset?.symbol}
            />
            <span className="space-x-1">
              <span className="text-2xl font-bold">
                {collectModule.amount.value}
              </span>
              <span className="text-xs">
                {collectModule?.amount?.asset?.symbol}
              </span>
            </span>
          </div>
        )}
        <div className="space-y-1.5">
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
                  {formatAddress(collectModule.recipient)}
                </a>
              </div>
            </div>
          )}
        </div>
        {currentUser ? (
          allowanceLoading ? (
            <div className="w-28 mt-5 rounded-lg h-[34px] shimmer" />
          ) : allowed ? (
            <div className="mt-5">
              <AllowanceButton
                title="Allow module"
                module={allowanceData?.approvedModuleAllowanceAmount[0]}
                allowed={allowed}
                setAllowed={setAllowed}
              />
            </div>
          ) : (
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
          )
        ) : null}
      </div>
    </>
  )
}

export default CollectModule
