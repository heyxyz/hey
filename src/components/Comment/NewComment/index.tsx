import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import Attachment from '@components/Post/NewPost/Attachment'
import Attachments from '@components/Shared/Attachments'
import IndexStatus from '@components/Shared/IndexStatus'
import SelectCollectModule from '@components/Shared/SelectCollectModule'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { EnabledModule } from '@generated/types'
import { ChatAlt2Icon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
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
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

const CREATE_COMMENT_TYPED_DATA_MUTATION = gql`
  mutation CreateCommentTypedData($request: CreatePublicCommentRequest!) {
    createCommentTypedData(request: $request) {
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
          collectModuleData
          referenceModule
          referenceModuleData
        }
      }
    }
  }
`

const newCommentSchema = object({
  comment: string()
    .min(2, { message: 'Handle should be atleast 2 characters' })
    .max(500, { message: 'Handle should not exceed 500 characters' })
})

interface Props {
  post: LensterPost
}

const NewComment: React.FC<Props> = ({ post }) => {
  const form = useZodForm({
    schema: newCommentSchema
  })

  const { currentUser } = useContext(AppContext)
  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<
    [{ item: string; type: string }] | []
  >([])
  const [{ data: network }, switchNetwork] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()

  const [{ data, error, loading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'commentWithSig'
  )

  const [createCommentTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COMMENT_TYPED_DATA_MUTATION,
    {
      onCompleted({ createCommentTypedData }: any) {
        const { typedData } = createCommentTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
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
              profileIdPointed,
              pubIdPointed,
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
                setAttachments([])
                setSelectedModule(defaultModuleData)
                setFeeData(defaultFeeData)
              } else {
                toast.error(error?.message)
              }
            })
          } else {
            toast.error(res.error?.message)
          }
        })
      },
      onError() {
        toast.error(ERROR_MESSAGE)
      }
    }
  )

  const createComment = async (comment: string) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== 80001) {
      toast.error(WRONG_NETWORK)
    } else {
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: comment,
        content: comment,
        external_url: null,
        image: attachments.length > 0 ? attachments[0]?.item : null,
        imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
        name: `Comment by @${currentUser?.handle}`,
        attributes: [],
        media: attachments,
        appId: 'Lenster'
      }).finally(() => setIsUploading(false))

      createCommentTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            publicationId: post.pubId,
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
          onSubmit={({ comment }) => {
            createComment(comment)
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
            placeholder="Tell something cool!"
            {...form.register('comment')}
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
                  disabled={
                    isUploading || typedDataLoading || signLoading || loading
                  }
                  icon={
                    isUploading ||
                    typedDataLoading ||
                    signLoading ||
                    loading ? (
                      <Spinner size="xs" />
                    ) : (
                      <ChatAlt2Icon className="w-4 h-4" />
                    )
                  }
                >
                  {isUploading
                    ? 'Uploading to IPFS'
                    : typedDataLoading
                    ? 'Generating Comment'
                    : signLoading
                    ? 'Sign'
                    : loading
                    ? 'Send'
                    : 'Comment'}
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

export default NewComment
