import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import Attachments from '@components/Shared/Attachments'
import IndexStatus from '@components/Shared/IndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import { CreatePostBroadcastItemResult, EnabledModule } from '@generated/types'
import { IGif } from '@giphy/js-types'
import { PencilAltIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import uploadToIPFS from '@lib/uploadToIPFS'
import dynamic from 'next/dynamic'
import { Dispatch, FC, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

const Attachment = dynamic(() => import('../../Shared/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
})
const Giphy = dynamic(() => import('../../Shared/Giphy'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
})
const SelectCollectModule = dynamic(
  () => import('../../Shared/SelectCollectModule'),
  {
    loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
  }
)
const SelectReferenceModule = dynamic(
  () => import('../../Shared/SelectReferenceModule'),
  {
    loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
  }
)

export const CREATE_POST_TYPED_DATA_MUTATION = gql`
  mutation CreatePostTypedData($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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

interface Props {
  refetch?: any
  setShowModal?: Dispatch<boolean>
  hideCard?: boolean
}

const NewPost: FC<Props> = ({ refetch, setShowModal, hideCard = false }) => {
  const form = useZodForm({
    schema: newPostSchema
  })

  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [onlyFollowers, setOnlyFollowers] = useState<boolean>(false)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<
    [{ item: string; type: string }] | []
  >([])
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
    error,
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
        setAttachments([])
        setSelectedModule(defaultModuleData)
        setFeeData(defaultFeeData)
        trackEvent('new post', 'create')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

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

  const createPost = async (post: string) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
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
        attributes: [
          {
            traitType: 'string',
            key: 'type',
            value: 'post'
          }
        ],
        media: attachments,
        appId: 'Lenster'
      }).finally(() => setIsUploading(false))

      createPostTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            contentURI: `https://ipfs.infura.io/ipfs/${path}`,
            collectModule: feeData.recipient
              ? {
                  [getModule(selectedModule.moduleName).config]: feeData
                }
              : getModule(selectedModule.moduleName).config,
            referenceModule: {
              followerOnlyReferenceModule: onlyFollowers ? true : false
            }
          }
        }
      })
    }
  }

  const setGifAttachment = (gif: IGif) => {
    const attachment = {
      item: gif.images.original.url,
      type: 'image/gif'
    }
    // @ts-ignore
    setAttachments([...attachments, attachment])
  }

  return (
    <Card className={hideCard ? 'border-0 !shadow-none !bg-transparent' : ''}>
      <div className="px-5 pt-5 pb-3">
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
          <div className="block items-center sm:flex">
            <div className="flex items-center space-x-4">
              <Attachment
                attachments={attachments}
                setAttachments={setAttachments}
              />
              <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
              <SelectCollectModule
                feeData={feeData}
                setFeeData={setFeeData}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
              />
              <SelectReferenceModule
                onlyFollowers={onlyFollowers}
                setOnlyFollowers={setOnlyFollowers}
              />
            </div>
            <div className="flex items-center pt-2 ml-auto space-x-2 sm:pt-0">
              {data?.hash && (
                <IndexStatus
                  setShowModal={setShowModal}
                  refetch={refetch}
                  type="Post"
                  txHash={data?.hash}
                />
              )}
              {activeChain?.unsupported ? (
                <SwitchNetwork className="ml-auto" />
              ) : (
                <Button
                  className="ml-auto"
                  disabled={
                    isUploading ||
                    typedDataLoading ||
                    signLoading ||
                    writeLoading
                  }
                  icon={
                    isUploading ||
                    typedDataLoading ||
                    signLoading ||
                    writeLoading ? (
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
                    : signLoading
                    ? 'Sign'
                    : writeLoading
                    ? 'Send'
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
      </div>
    </Card>
  )
}

export default NewPost
