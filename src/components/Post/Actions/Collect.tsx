import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

const CREATE_COLLECT_TYPED_DATA_MUTATION = gql`
  mutation CreateCollectTypedData($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      typedData {
        value {
          profileId
          pubId
          data
        }
      }
    }
  }
`

interface Props {
  post: LensterPost
}

const Collect: React.FC<Props> = ({ post }) => {
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()

  const [{ loading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'collect'
  )

  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      onCompleted(data: any) {
        const {
          profileId,
          pubId,
          data: collectData
        } = data?.createCollectTypedData?.typedData?.value
        const inputArray = [profileId, pubId, collectData]

        console.log(inputArray)

        write({ args: inputArray }).then(({ error }) => {
          if (!error) {
            toast.success('Post has been collected!')
          } else {
            // @ts-ignore
            toast.error(error?.data?.message)
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createCollect = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== 80001) {
      toast.error(WRONG_NETWORK)
    } else {
      createCollectTypedData({
        variables: {
          request: {
            publicationId: post.pubId
          }
        }
      })
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={createCollect}
      disabled={typedDataLoading || loading}
    >
      <div className="flex items-center space-x-1 text-red-500 hover:red-brand-400">
        <div className="hover:bg-red-300 hover:bg-opacity-20 p-1.5 rounded-full">
          {typedDataLoading || loading ? (
            <Spinner variant="danger" size="xs" />
          ) : (
            <CollectionIcon className="w-[18px]" />
          )}
        </div>
        {post?.stats?.totalAmountOfCollects > 0 && (
          <div className="text-xs">
            {humanize(post?.stats?.totalAmountOfCollects)}
          </div>
        )}
      </div>
    </motion.button>
  )
}

export default Collect
