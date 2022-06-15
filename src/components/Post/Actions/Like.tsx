import { Tooltip } from '@components/UI/Tooltip'
import { LensterPost } from '@generated/lenstertypes'
import { HeartIcon } from '@heroicons/react/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import humanize from '@lib/humanize'
import { motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CHAIN_ID, CONNECT_WALLET, WRONG_NETWORK } from 'src/constants'
import { useAccount, useNetwork } from 'wagmi'

interface Props {
  post: LensterPost
}

const Like: FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()

  useEffect(() => {
    if (
      post?.mirrorOf?.stats?.totalAmountOfMirrors ||
      post?.stats?.totalAmountOfMirrors
    ) {
      setCount(
        post.__typename === 'Mirror'
          ? post?.mirrorOf?.stats?.totalAmountOfMirrors
          : post?.stats?.totalAmountOfMirrors
      )
      setLiked(false)
    }
  }, [post])

  const createLike = () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      setLiked(!liked)
      setCount(liked ? count - 1 : count + 1)
      toast.success('WIP')
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={createLike}
      aria-label="Like"
    >
      <div className="flex items-center space-x-1 text-pink-500">
        <div className="p-1.5 rounded-full hover:bg-opacity-20 hover:bg-pink-300">
          <Tooltip placement="top" content="Like" withDelay>
            {liked ? (
              <HeartIconSolid className="w-[18px]" />
            ) : (
              <HeartIcon className="w-[18px]" />
            )}
          </Tooltip>
        </div>
        {count > 0 && <div className="text-xs">{humanize(count)}</div>}
      </div>
    </motion.button>
  )
}

export default Like
