import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation } from '@apollo/client'
import Attachments from '@components/Shared/Attachments'
import Markup from '@components/Shared/Markup'
import PubIndexStatus from '@components/Shared/PubIndexStatus'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { MentionTextArea } from '@components/UI/MentionTextArea'
import { Spinner } from '@components/UI/Spinner'
import { LensterAttachment } from '@generated/lenstertypes'
import { CreatePostBroadcastItemResult, EnabledModule } from '@generated/types'
import { IGif } from '@giphy/js-types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { PencilAltIcon } from '@heroicons/react/outline'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import { Mixpanel } from '@lib/mixpanel'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trimify from '@lib/trimify'
import uploadToIPFS from '@lib/uploadToIPFS'
import dynamic from 'next/dynamic'
import { Dispatch, FC, useState } from 'react'
import toast from 'react-hot-toast'
import {
  APP_NAME,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON,
  SIGN_WALLET
} from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { POST } from 'src/tracking'
import { v4 as uuid } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

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
  mutation CreatePostTypedData(
    $options: TypedDataOptions
    $request: CreatePublicPostRequest!
  ) {
    createPostTypedData(options: $options, request: $request) {
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
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated)
  const currentUser = useAppPersistStore((state) => state.currentUser)
  const [postContent, setPostContent] = useState<string>('')
  const [preview, setPreview] = useState<boolean>(false)
  const [postContentError, setPostContentError] = useState<string>('')
  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [onlyFollowers, setOnlyFollowers] = useState<boolean>(false)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<LensterAttachment[]>([])
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
    Mixpanel.track(POST.NEW, { result: 'success' })
  }

  const {
    data,
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess() {
      onCompleted()
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onCompleted,
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        Mixpanel.track(POST.NEW, { result: 'broadcast_error' })
      }
    })
  const [createPostTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult
      }) {
        const { id, typedData } = createPostTypedData
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData,
          deadline
        } = typedData?.value

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          setUserSigNonce(userSigNonce + 1)
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline }
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
            const {
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } })

            if ('reason' in result)
              write?.({ recklesslySetUnpreparedArgs: inputStruct })
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct })
          }
        } catch (error) {}
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createPost = async () => {
    if (!isAuthenticated) return toast.error(SIGN_WALLET)
    if (postContent.length === 0 && attachments.length === 0) {
      Mixpanel.track(POST.NEW, { result: 'empty' })
      return setPostContentError('Post should not be empty!')
    }

    setPostContentError('')
    setIsUploading(true)
    // TODO: Add animated_url support
    const { path } = await uploadToIPFS({
      version: '1.0.0',
      metadata_id: uuid(),
      description: trimify(postContent),
      content: trimify(postContent),
      external_url: `https://lenster.xyz/u/${currentUser?.handle}`,
      image: attachments.length > 0 ? attachments[0]?.item : null,
      imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
      name: `Post by @${currentUser?.handle}`,
      mainContentFocus:
        attachments.length > 0
          ? attachments[0]?.type === 'video/mp4'
            ? 'VIDEO'
            : 'IMAGE'
          : 'TEXT',
      contentWarning: null, // TODO
      attributes: [
        {
          traitType: 'string',
          key: 'type',
          value: 'post'
        }
      ],
      media: attachments,
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => setIsUploading(false))

    createPostTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
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

  const setGifAttachment = (gif: IGif) => {
    const attachment = {
      item: gif.images.original.url,
      type: 'image/gif',
      altTag: ''
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
              publication={postContent}
              setPublication={setPostContent}
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
