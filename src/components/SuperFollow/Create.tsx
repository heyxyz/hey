import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation, useQuery } from '@apollo/client'
import { MODULES_CURRENCY_QUERY } from '@components/Crowdfund/Create'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SettingsHelper from '@components/Shared/SettingsHelper'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import {
  CreateSetFollowModuleBroadcastItemResult,
  Erc20
} from '@generated/types'
import { StarIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import getTokenImage from '@lib/getTokenImage'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import React, { FC, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  DEFAULT_COLLECT_TOKEN,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import Custom404 from 'src/pages/404'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

import Pending from './Pending'

const newCrowdfundSchema = object({
  amount: string().min(1, { message: 'Invalid amount' }),
  recipient: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Ethereum address' })
})

export const CREATE_SET_FOLLOW_MODULE_TYPED_DATA_MUTATION = gql`
  mutation CreateSetFollowModuleTypedData(
    $request: CreateSetFollowModuleRequest!
  ) {
    createSetFollowModuleTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModuleWithSig {
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
          followModule
          followModuleData
        }
      }
    }
  }
`

const SuperFollow: FC = () => {
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    DEFAULT_COLLECT_TOKEN
  )
  const [selectedCurrencySymobol, setSelectedCurrencySymobol] =
    useState<string>('WMATIC')
  const { currentUser } = useContext(AppContext)
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const { data: currencyData, loading } = useQuery(MODULES_CURRENCY_QUERY, {
    onCompleted() {
      consoleLog('Fetch', '#8b5cf6', `Fetched enabled module currencies`)
    }
  })
  const [{ data, loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setFollowModuleWithSig'
  )

  const form = useZodForm({
    schema: newCrowdfundSchema,
    defaultValues: {
      recipient: currentUser?.ownedBy
    }
  })

  const [createSetFollowModuleTypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_FOLLOW_MODULE_TYPED_DATA_MUTATION, {
      onCompleted({
        createSetFollowModuleTypedData
      }: {
        createSetFollowModuleTypedData: CreateSetFollowModuleBroadcastItemResult
      }) {
        const { typedData } = createSetFollowModuleTypedData
        const { profileId, followModule, followModuleData } = typedData?.value

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { v, r, s } = splitSignature(res.data)
            const inputStruct = {
              profileId,
              followModule,
              followModuleData,
              sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline
              }
            }

            write({ args: inputStruct }).then(({ error }) => {
              if (!error) {
                form.reset()
                trackEvent('set superfollow', 'create')
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
    })

  const setSuperFollow = (amount: string, recipient: string) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createSetFollowModuleTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            followModule: {
              feeFollowModule: {
                amount: {
                  currency: selectedCurrency,
                  value: amount
                },
                recipient
              }
            }
          }
        }
      })
    }
  }

  if (loading) return <PageLoading message="Loading create crowdfund" />
  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title="Create Crowdfund • Lenster" />
      <GridItemFour>
        <SettingsHelper
          heading="Create crowdfund"
          description="Create new decentralized crowdfund"
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {data?.hash ? (
            <Pending txHash={data?.hash} />
          ) : (
            <Form
              form={form}
              className="p-5 space-y-4"
              onSubmit={({ amount, recipient }) => {
                setSuperFollow(amount, recipient)
              }}
            >
              <div>
                <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                  Select Currency
                </div>
                <select
                  className="w-full bg-white border border-gray-300 outline-none rounded-xl dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
                  onChange={(e) => {
                    const currency = e.target.value.split('-')
                    setSelectedCurrency(currency[0])
                    setSelectedCurrencySymobol(currency[1])
                  }}
                >
                  {currencyData?.enabledModuleCurrencies?.map(
                    (currency: Erc20) => (
                      <option
                        key={currency.symbol}
                        value={`${currency.address}-${currency.symbol}`}
                      >
                        {currency.name}
                      </option>
                    )
                  )}
                </select>
              </div>
              <Input
                label="Follow amount"
                type="number"
                step="0.0001"
                prefix={
                  <img
                    className="w-6 h-6"
                    src={getTokenImage(selectedCurrencySymobol)}
                    alt={selectedCurrencySymobol}
                  />
                }
                placeholder="5"
                {...form.register('amount')}
              />
              <Input
                label="Funds recipient"
                type="text"
                placeholder="0x3A5bd...5e3"
                {...form.register('recipient')}
              />
              <div className="ml-auto">
                {network.chain?.unsupported ? (
                  <SwitchNetwork />
                ) : (
                  <Button
                    type="submit"
                    disabled={typedDataLoading || signLoading || writeLoading}
                    icon={
                      typedDataLoading || signLoading || writeLoading ? (
                        <Spinner size="xs" />
                      ) : (
                        <StarIcon className="w-4 h-4" />
                      )
                    }
                  >
                    Set Super Follow
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default SuperFollow
