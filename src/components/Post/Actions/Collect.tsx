import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { LensterPost } from '@generated/lenstertypes'
import { CreateCollectBroadcastItemResult } from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import { getModule } from '@lib/getModule'
import { humanize } from '@lib/humanize'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import {
  chain,
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

const CREATE_COLLECT_TYPED_DATA_MUTATION = gql`
  mutation CreateCollectTypedData($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'collectWithSig'
  )

  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult
      }) {
        const { typedData } = createCollectTypedData

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { profileId, pubId, data: collectData } = typedData?.value
            const { v, r, s } = splitSignature(res.data)
            const inputStruct = {
              collector: account?.address,
              profileId,
              pubId,
              data: collectData,
              sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline
              }
            }

            write({ args: inputStruct }).then(({ error }: { error: any }) => {
              if (!error) {
                toast.success('Post has been collected!')
              } else {
                if (
                  error?.data?.message ===
                  'execution reverted: SafeERC20: low-level call failed'
                ) {
                  toast.error(
                    `Please allow ${
                      getModule(post.collectModule.type).name
                    } module in allowance settings`
                  )
                } else {
                  toast.error(error?.data?.message)
                }
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

  const createCollect = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== chain.polygonTestnetMumbai.id) {
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
      disabled={typedDataLoading || signLoading || writeLoading}
    >
      <div className="flex items-center space-x-1 text-red-500 hover:red-brand-400">
        <div className="hover:bg-red-300 hover:bg-opacity-20 p-1.5 rounded-full">
          {typedDataLoading || signLoading || writeLoading ? (
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
