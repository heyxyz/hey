import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import Attachments from '@components/Shared/Attachments'
import IndexStatus from '@components/Shared/IndexStatus'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import { EnabledModule } from '@generated/types'
import { PencilAltIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import { uploadToIPFS } from '@lib/uploadToIPFS'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { v4 as uuidv4 } from 'uuid'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'
import { object, string } from 'zod'

import SelectCollectModule from '../../Shared/SelectCollectModule'
import Attachment from './Attachment'

const CREATE_POST_TYPED_DATA_MUTATION = gql`
  mutation CreatePostTypedData($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      typedData {
        value {
          profileId
          contentURI
          collectModule
          collectModuleData
          referenceModule
          referenceModuleData
        }
      }
    }
  }
`

const newPostSchema = object({
  post: string()
    .min(2, { message: 'Post should be atleast 2 characters' })
    .max(500, { message: 'Post should not exceed 500 characters' })
})

const NewPost: React.FC = () => {
  const form = useZodForm({
    schema: newPostSchema
  })

  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<
    [{ item: string; type: string }] | []
  >([])
  const { currentUser } = useContext(AppContext)
  const [{ data: network }, switchNetwork] = useNetwork()
  const [{ data: account }] = useAccount()

  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'post'
  )

  const [createPostTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      onCompleted(data: any) {
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleData,
          referenceModule,
          referenceModuleData
        } = data?.createPostTypedData?.typedData?.value

        const inputStruct = {
          profileId,
          contentURI,
          collectModule,
          collectModuleData,
          referenceModule,
          referenceModuleData
        }

        write({ args: inputStruct }).then(({ error }) => {
          if (!error) {
            form.reset()
            setAttachments([])
            setSelectedModule(defaultModuleData)
            setFeeData(defaultFeeData)
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

  const createPost = async (post: string) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== 80001) {
      toast.error(WRONG_NETWORK)
    } else {
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: post,
        content: post,
        external_url: null,
        image: attachments.length > 0 ? attachments[0]?.item : null,
        imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
        name: `Post by @${currentUser?.handle}`,
        attributes: [],
        media: attachments,
        appId: 'Lenster'
      }).finally(() => setIsUploading(false))

      createPostTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            contentURI: `ipfs://${path}`,
            collectModule: feeData.recipient
              ? {
                  [getModule(selectedModule.moduleName).config]: feeData
                }
              : getModule(selectedModule.moduleName).config,
            referenceModule: {
              followerOnlyReferenceModule: false
            }
          }
        }
      })
    }
  }

  return (
    <Card>
      <CardBody>
        <Form
          form={form}
          className="space-y-1"
          onSubmit={({ post }) => {
            createPost(post)
          }}
        >
          {error && (
            <ErrorMessage
              className="mb-3"
              title="Transaction failed!"
              error={error}
            />
          )}
          <TextArea
            placeholder="What's happening?"
            {...form.register('post')}
          />
          <div className="flex items-center">
            <div className="flex space-x-1">
              <Attachment
                attachments={attachments}
                setAttachments={setAttachments}
              />
              <SelectCollectModule
                feeData={feeData}
                setFeeData={setFeeData}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
              />
            </div>
            <div className="flex items-center ml-auto space-x-2">
              {data?.hash && <IndexStatus txHash={data?.hash} />}
              {network.chain?.unsupported ? (
                <Button
                  type="button"
                  variant="danger"
                  icon={<SwitchHorizontalIcon className="w-4 h-4" />}
                  // @ts-ignore
                  onClick={() => switchNetwork(80001)}
                >
                  Switch Network
                </Button>
              ) : (
                <Button
                  disabled={isUploading || typedDataLoading || loading}
                  icon={
                    isUploading || typedDataLoading || loading ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilAltIcon className="w-4 h-4" />
                    )
                  }
                >
                  {isUploading
                    ? 'Uploading to IPFS'
                    : typedDataLoading
                    ? 'Generating Post'
                    : loading
                    ? 'Sign'
                    : 'Post'}
                </Button>
              )}
            </div>
          </div>
          <Attachments
            attachments={attachments}
            setAttachments={setAttachments}
            isNew
          />
        </Form>
      </CardBody>
    </Card>
  )
}

export default NewPost
