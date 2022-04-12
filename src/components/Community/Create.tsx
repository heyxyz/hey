import LensHubProxy from '@abis/LensHubProxy.json'
import { useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { CREATE_POST_TYPED_DATA_MUTATION } from '@components/Post/NewPost'
import ChooseFile from '@components/Shared/ChooseFile'
import Pending from '@components/Shared/Pending'
import SettingsHelper from '@components/Shared/SettingsHelper'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { CreatePostBroadcastItemResult } from '@generated/types'
import { PlusIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import uploadAssetsToIPFS from '@lib/uploadAssetsToIPFS'
import uploadToIPFS from '@lib/uploadToIPFS'
import React, { ChangeEvent, FC, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import Custom404 from 'src/pages/404'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

const newCommunitySchema = object({
  name: string()
    .min(2, { message: 'Name should be atleast 2 characters' })
    .max(31, { message: 'Name should be less than 32 characters' }),
  description: string()
    .max(260, { message: 'Description should not exceed 260 characters' })
    .nullable()
})

const Create: FC = () => {
  const [avatar, setAvatar] = useState<string>()
  const [avatarType, setAvatarType] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const {
    data,
    isLoading: writeLoading,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'postWithSig',
    {
      onSuccess() {
        form.reset()
        trackEvent('new community', 'create')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

  const form = useZodForm({
    schema: newCommunitySchema
  })

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      // @ts-ignore
      const attachment = await uploadAssetsToIPFS(evt.target.files[0])
      setAvatar(attachment.item)
      setAvatarType(attachment.type)
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
        consoleLog('Mutation', '#4ade80', 'Generated createPostTypedData')
        const { typedData } = createPostTypedData
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleData,
          referenceModule,
          referenceModuleData
        } = typedData?.value

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { v, r, s } = splitSignature(signature)
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
          write({ args: inputStruct })
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createCommunity = async (name: string, description: string | null) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: description,
        content: description,
        external_url: null,
        image: avatar ? avatar : `https://avatar.tobi.sh/${uuidv4()}.png`,
        imageMimeType: avatarType,
        name: name,
        attributes: [
          {
            traitType: 'type',
            value: 'community'
          }
        ],
        media: [],
        appId: 'Lenster Community'
      }).finally(() => setIsUploading(false))

      createPostTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            contentURI: `https://ipfs.infura.io/ipfs/${path}`,
            collectModule: {
              freeCollectModule: {
                followerOnly: false
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

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title="Create Community • Lenster" />
      <GridItemFour>
        <SettingsHelper
          heading="Create community"
          description="Create new decentralized community"
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {data?.hash ? (
            <Pending
              txHash={data?.hash}
              indexing="Community creation in progress, please wait!"
              indexed="Community created successfully"
              type="community"
              urlPrefix="communities"
            />
          ) : (
            <Form
              form={form}
              className="p-5 space-y-4"
              onSubmit={({ name, description }) => {
                createCommunity(name, description)
              }}
            >
              <Input
                label="Name"
                type="text"
                placeholder="minecraft"
                {...form.register('name')}
              />
              <TextArea
                label="Description"
                placeholder="Tell us something about the community!"
                {...form.register('description')}
              />
              <div className="space-y-1.5">
                <label>Avatar</label>
                <div className="space-y-3">
                  {avatar && (
                    <img
                      className="rounded-lg w-60 h-60"
                      src={avatar}
                      alt={avatar}
                    />
                  )}
                  <div className="flex items-center space-x-3">
                    <ChooseFile
                      onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                        handleUpload(evt)
                      }
                    />
                    {uploading && <Spinner size="sm" />}
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                {activeChain?.unsupported ? (
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
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default Create
