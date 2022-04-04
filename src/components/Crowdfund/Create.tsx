import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { CREATE_POST_TYPED_DATA_MUTATION } from '@components/Post/NewPost'
import ChooseFile from '@components/Shared/ChooseFile'
import SettingsHelper from '@components/Shared/SettingsHelper'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { CreatePostBroadcastItemResult, Erc20 } from '@generated/types'
import { PlusIcon } from '@heroicons/react/outline'
import { getTokenImage } from '@lib/getTokenImage'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { trackEvent } from '@lib/trackEvent'
import { uploadAssetsToIPFS } from '@lib/uploadAssetsToIPFS'
import { uploadToIPFS } from '@lib/uploadToIPFS'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  DEFAULT_COLLECT_TOKEN,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import Custom404 from 'src/pages/404'
import { v4 as uuidv4 } from 'uuid'
import {
  chain,
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

import Pending from './Pending'

export const MODULES_CURRENCY_QUERY = gql`
  query EnabledCurrencyModules {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`

const newCrowdfundSchema = object({
  title: string()
    .min(2, { message: 'Title should be atleast 2 characters' })
    .max(255, { message: 'Title should not exceed 255 characters' }),
  amount: string().min(1, { message: 'Invalid amount' }),
  goal: string().min(1, { message: 'Invalid goal' }),
  recipient: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Ethereum address' }),
  description: string()
    .max(1000, { message: 'Description should not exceed 1000 characters' })
    .nullable()
})

const Create: React.FC = () => {
  const [cover, setCover] = useState<string>()
  const [coverType, setCoverType] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
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
  const {
    error,
    data: currencyData,
    loading
  } = useQuery(MODULES_CURRENCY_QUERY)
  const [{ data, loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'postWithSig'
  )

  const form = useZodForm({
    schema: newCrowdfundSchema,
    defaultValues: {
      recipient: currentUser?.ownedBy
    }
  })

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      // @ts-ignore
      const attachment = await uploadAssetsToIPFS(evt.target.files[0])
      setCover(attachment.item)
      setCoverType(attachment.type)
    } finally {
      setUploading(false)
    }
  }

  const [createPostTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult
      }) {
        const { typedData } = createPostTypedData
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleData,
          referenceModule,
          referenceModuleData
        } = typedData?.value

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { v, r, s } = splitSignature(res.data)
            const inputStruct = {
              profileId,
              contentURI,
              collectModule,
              collectModuleData,
              referenceModule,
              referenceModuleData,
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
                trackEvent('new crowdfund', 'create')
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

  const createCrowdfund = async (
    title: string,
    amount: string,
    goal: string,
    recipient: string,
    description: string | null
  ) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== chain.polygonTestnetMumbai.id) {
      toast.error(WRONG_NETWORK)
    } else {
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: description,
        content: description,
        external_url: null,
        image: cover ? cover : `https://avatar.tobi.sh/${uuidv4()}.svg`,
        imageMimeType: coverType,
        name: title,
        attributes: [
          {
            traitType: 'type',
            value: 'crowdfund'
          },
          {
            traitType: 'goal',
            value: goal
          }
        ],
        media: [],
        appId: 'Lenster Crowdfund'
      }).finally(() => setIsUploading(false))

      createPostTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            contentURI: `https://ipfs.infura.io/ipfs/${path}`,
            collectModule: {
              feeCollectModule: {
                amount: {
                  currency: selectedCurrency,
                  value: amount
                },
                recipient,
                referralFee: 0
              }
            },
            referenceModule: {
              followerOnlyReferenceModule: false
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
          <CardBody>
            {data?.hash ? (
              <Pending txHash={data?.hash} />
            ) : (
              <Form
                form={form}
                className="space-y-4"
                onSubmit={({ title, amount, goal, recipient, description }) => {
                  createCrowdfund(title, amount, goal, recipient, description)
                }}
              >
                <Input
                  label="Title"
                  type="text"
                  placeholder="Lenster DAO"
                  {...form.register('title')}
                />
                <div>
                  <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                    Select Currency
                  </div>
                  <select
                    className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
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
                  label="Contribution amount"
                  type="number"
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
                  label="Funding Goal"
                  type="number"
                  prefix={
                    <img
                      className="w-6 h-6"
                      src={getTokenImage(selectedCurrencySymobol)}
                      alt={selectedCurrencySymobol}
                    />
                  }
                  placeholder="420"
                  {...form.register('goal')}
                />
                <Input
                  label="Funds recipient"
                  type="text"
                  placeholder="0x3A5bd...5e3"
                  {...form.register('recipient')}
                />
                <TextArea
                  label="Description"
                  placeholder="Tell us something about the fundraise!"
                  {...form.register('description')}
                />
                <div className="space-y-1.5">
                  <label>Cover Image</label>
                  <div className="space-y-3">
                    {cover && (
                      <div>
                        <img
                          className="object-cover w-full h-60 rounded-lg"
                          src={cover}
                          alt={cover}
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-3">
                        <ChooseFile
                          onChange={(
                            evt: React.ChangeEvent<HTMLInputElement>
                          ) => handleUpload(evt)}
                        />
                        {uploading && <Spinner size="sm" />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  {network.chain?.unsupported ? (
                    <SwitchNetwork />
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        typedDataLoading ||
                        isUploading ||
                        signLoading ||
                        writeLoading
                      }
                      icon={
                        typedDataLoading ||
                        isUploading ||
                        signLoading ||
                        writeLoading ? (
                          <Spinner size="xs" />
                        ) : (
                          <PlusIcon className="w-4 h-4" />
                        )
                      }
                    >
                      Create
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default Create
