import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation } from '@apollo/client'
import Attachments from '@components/Shared/Attachments'
import Markup from '@components/Shared/Markup'
import PubIndexStatus from '@components/Shared/PubIndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { MentionTextArea } from '@components/UI/MentionTextArea'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterAttachment } from '@generated/lenstertypes'
import { CreatePostBroadcastItemResult, EnabledModule } from '@generated/types'
import { IGif } from '@giphy/js-types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
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
import trimify from '@lib/trimify'
import uploadToIPFS from '@lib/uploadToIPFS'
import dynamic from 'next/dynamic'
import { Dispatch, FC, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  RELAY_ON,
  WRONG_NETWORK
} from 'src/constants'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

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
const Preview = dynamic(() => import('../../Shared/Preview'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
})

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
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`

interface Props {
  setShowModal?: Dispatch<boolean>
  hideCard?: boolean
}

const NewPost: FC<Props> = ({ setShowModal, hideCard = false }) => {
  const [preview, setPreview] = useState<boolean>(false)
  const [postContent, setPostContent] = useState<string>('')
  const [postContentError, setPostContentError] = useState<string>('')
  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [onlyFollowers, setOnlyFollowers] = useState<boolean>(false)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<LensterAttachment[]>([])
  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const onCompleted = () => {
    setPreview(false)
    setPostContent('')
    setAttachments([])
    setSelectedModule(defaultModuleData)
    setFeeData(defaultFeeData)
    trackEvent('new post', 'create')
  }
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
        onCompleted()
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onCompleted({ broadcast }) {
        if (broadcast?.reason !== 'NOT_ALLOWED') {
          onCompleted()
        }
      },
      onError(error) {
        consoleLog('Relay Error', '#ef4444', error.message)
      }
    })
  const [createPostTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createPostTypedData')
        const { id, typedData } = createPostTypedData
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData
        } = typedData?.value

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            profileId,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ data: { broadcast }, errors }) => {
                if (errors || broadcast?.reason === 'NOT_ALLOWED') {
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

  const createPost = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else if (postContent.length === 0 && attachments.length === 0) {
      setPostContentError('Post should not be empty!')
    } else {
      setPostContentError('')
      setIsUploading(true)
      // TODO: Add animated_url support
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: trimify(postContent),
        content: trimify(postContent),
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
    setAttachments([...attachments, attachment])
  }

  return (
    <Card className={hideCard ? 'border-0 !shadow-none !bg-transparent' : ''}>
      <div className="px-5 pt-5 pb-3">
        <div className="space-y-1">
          {error && (
            <ErrorMessage
              className="mb-3"
              title="Transaction failed!"
              error={error}
            />
          )}
          {preview ? (
            <div className="pb-3 mb-2 border-b linkify dark:border-b-gray-700/80">
              <Markup>{postContent}</Markup>
            </div>
          ) : (
            <MentionTextArea
              value={postContent}
              setValue={setPostContent}
              error={postContentError}
              setError={setPostContentError}
              placeholder="What's happening?"
            />
          )}
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
              {postContent && (
                <Preview preview={preview} setPreview={setPreview} />
              )}
            </div>
            <div className="flex items-center pt-2 ml-auto space-x-2 sm:pt-0">
              {data?.hash ?? broadcastData?.broadcast?.txHash ? (
                <PubIndexStatus
                  setShowModal={setShowModal}
                  type="Post"
                  txHash={
                    data?.hash ? data?.hash : broadcastData?.broadcast?.txHash
                  }
                />
              ) : null}
              {activeChain?.id !== CHAIN_ID ? (
                <SwitchNetwork className="ml-auto" />
              ) : (
                <Button
                  className="ml-auto"
                  disabled={
                    isUploading ||
                    typedDataLoading ||
                    signLoading ||
                    writeLoading ||
                    broadcastLoading
                  }
                  icon={
                    isUploading ||
                    typedDataLoading ||
                    signLoading ||
                    writeLoading ||
                    broadcastLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilAltIcon className="w-4 h-4" />
                    )
                  }
                  onClick={createPost}
                >
                  {isUploading
                    ? 'Uploading to IPFS'
                    : typedDataLoading
                    ? 'Generating Post'
                    : signLoading
                    ? 'Sign'
                    : writeLoading || broadcastLoading
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
        </div>
      </div>
    </Card>
  )
}

export default NewPost
