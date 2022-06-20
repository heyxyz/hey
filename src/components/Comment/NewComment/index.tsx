import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation } from '@apollo/client'
import Attachments from '@components/Shared/Attachments'
import Markup from '@components/Shared/Markup'
import Preview from '@components/Shared/Preview'
import PubIndexStatus from '@components/Shared/PubIndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { MentionTextArea } from '@components/UI/MentionTextArea'
import { Spinner } from '@components/UI/Spinner'
import { LensterAttachment, LensterPost } from '@generated/lenstertypes'
import {
  CreateCommentBroadcastItemResult,
  EnabledModule
} from '@generated/types'
import { IGif } from '@giphy/js-types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { ChatAlt2Icon, PencilAltIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import generateSnowflake from '@lib/generateSnowflake'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trimify from '@lib/trimify'
import uploadToIPFS from '@lib/uploadToIPFS'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import {
  APP_NAME,
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON,
  WRONG_NETWORK
} from 'src/constants'
import useAppStore from 'src/store'
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

const CREATE_COMMENT_TYPED_DATA_MUTATION = gql`
  mutation CreateCommentTypedData(
    $options: TypedDataOptions
    $request: CreatePublicCommentRequest!
  ) {
    createCommentTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          profileIdPointed
          pubIdPointed
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`

interface Props {
  post: LensterPost
  type: 'comment' | 'community post'
}

const NewComment: FC<Props> = ({ post, type }) => {
  const [preview, setPreview] = useState<boolean>(false)
  const [commentContent, setCommentContent] = useState<string>('')
  const [commentContentError, setCommentContentError] = useState<string>('')
  const { currentUser, userSigNonce, setUserSigNonce } = useAppStore()
  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [onlyFollowers, setOnlyFollowers] = useState<boolean>(false)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<LensterAttachment[]>([])
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const onCompleted = () => {
    setPreview(false)
    setCommentContent('')
    setAttachments([])
    setSelectedModule(defaultModuleData)
    setFeeData(defaultFeeData)
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
    'commentWithSig',
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
      onCompleted(data) {
        if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
          onCompleted()
        }
      },
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        consoleLog('Relay Error', '#ef4444', error.message)
      }
    })
  const [createCommentTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COMMENT_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createCommentTypedData
      }: {
        createCommentTypedData: CreateCommentBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createCommentTypedData')
        const { id, typedData } = createCommentTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData
        } = typedData?.value

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          setUserSigNonce(userSigNonce + 1)
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            profileId,
            profileIdPointed,
            pubIdPointed,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ data, errors }) => {
                if (errors || data?.broadcast?.reason === 'NOT_ALLOWED') {
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

  const createComment = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else if (commentContent.length === 0 && attachments.length === 0) {
      setCommentContentError('Comment should not be empty!')
    } else {
      setCommentContentError('')
      setIsUploading(true)
      // TODO: Add animated_url support
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: generateSnowflake(),
        description: trimify(commentContent),
        content: trimify(commentContent),
        external_url: `https://lenster.xyz/u/${currentUser?.handle}`,
        image: attachments.length > 0 ? attachments[0]?.item : null,
        imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
        name: `Comment by @${currentUser?.handle}`,
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
            value: type
          }
        ],
        media: attachments,
        createdOn: new Date(),
        appId: APP_NAME
      }).finally(() => setIsUploading(false))
      createCommentTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: {
            profileId: currentUser?.id,
            publicationId:
              post?.__typename === 'Mirror' ? post?.mirrorOf?.id : post?.id,
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
      type: 'image/gif',
      altTag: ''
    }
    setAttachments([...attachments, attachment])
  }

  return (
    <Card>
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
              <Markup>{commentContent}</Markup>
            </div>
          ) : (
            <MentionTextArea
              value={commentContent}
              setValue={setCommentContent}
              error={commentContentError}
              setError={setCommentContentError}
              placeholder="Tell something cool!"
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
              {commentContent && (
                <Preview preview={preview} setPreview={setPreview} />
              )}
            </div>
            <div className="flex items-center pt-2 ml-auto space-x-2 sm:pt-0">
              {data?.hash ?? broadcastData?.broadcast?.txHash ? (
                <PubIndexStatus
                  type={type === 'comment' ? 'Comment' : 'Post'}
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
                    ) : type === 'community post' ? (
                      <PencilAltIcon className="w-4 h-4" />
                    ) : (
                      <ChatAlt2Icon className="w-4 h-4" />
                    )
                  }
                  onClick={createComment}
                >
                  {isUploading
                    ? 'Uploading to IPFS'
                    : typedDataLoading
                    ? `Generating ${type === 'comment' ? 'Comment' : 'Post'}`
                    : signLoading
                    ? 'Sign'
                    : writeLoading || broadcastLoading
                    ? 'Send'
                    : type === 'comment'
                    ? 'Comment'
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

export default NewComment
