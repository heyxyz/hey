import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { DuplicateIcon } from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

const CREATE_MIRROR_TYPED_DATA_QUERY = gql`
  mutation CreateMirrorTypedData($request: CreateMirrorRequest!) {
    createMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
          referenceModule
          referenceModuleData
        }
      }
    }
  }
`

interface Props {
  post: LensterPost
}

const Mirror: React.FC<Props> = ({ post }) => {
  const { currentUser } = useContext(AppContext)
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'mirrorWithSig'
  )

  const [createMirrorTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_MIRROR_TYPED_DATA_QUERY,
    {
      onCompleted({ createMirrorTypedData }: any) {
        const { typedData } = createMirrorTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
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
                toast.success('Post has been mirrored!')
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

  const createMirror = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== 80001) {
      toast.error(WRONG_NETWORK)
    } else {
      createMirrorTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            publicationId: post.pubId,
            referenceModule: {
              followerOnlyReferenceModule: true
            }
          }
        }
      })
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={createMirror}
      disabled={typedDataLoading || writeLoading}
    >
      <div className="flex items-center space-x-1 text-brand-500 hover:text-brand-400">
        <div className="hover:bg-brand-300 hover:bg-opacity-20 p-1.5 rounded-full">
          {typedDataLoading || signLoading || writeLoading ? (
            <Spinner size="xs" />
          ) : (
            <DuplicateIcon className="w-[18px]" />
          )}
        </div>
        {post?.stats?.totalAmountOfMirrors > 0 && (
          <div className="text-xs">
            {humanize(post?.stats?.totalAmountOfMirrors)}
          </div>
        )}
      </div>
    </motion.button>
  )
}

export default Mirror
