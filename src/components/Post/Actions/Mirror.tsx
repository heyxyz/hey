import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { DuplicateIcon } from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

const CREATE_MIRROR_TYPED_DATA_QUERY = gql`
  mutation CreateMirrorTypedData($request: CreateMirrorRequest!) {
    createMirrorTypedData(request: $request) {
      id
      typedData {
        value {
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

  const [{ loading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'mirror'
  )

  const [createMirrorTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_MIRROR_TYPED_DATA_QUERY,
    {
      onCompleted(data: any) {
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData
        } = data?.createMirrorTypedData?.typedData?.value

        const inputStruct = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData
        }

        write({ args: inputStruct }).then(({ error }) => {
          if (!error) {
            toast.success('Post has been mirrored!')
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
      disabled={typedDataLoading || loading}
    >
      <div className="flex items-center space-x-1 text-brand-500 hover:text-brand-400">
        <div className="hover:bg-brand-300 hover:bg-opacity-20 p-1.5 rounded-full">
          {typedDataLoading || loading ? (
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
