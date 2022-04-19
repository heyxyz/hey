import { Modal } from '@components/UI/Modal'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { LensterPost } from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import { getModule } from '@lib/getModule'
import humanize from '@lib/humanize'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'

const CollectModule = dynamic(() => import('./CollectModule'), {
  loading: () => <div className="m-5 h-5 rounded-lg shimmer" />
})

interface Props {
  post: LensterPost
}

const Collect: FC<Props> = ({ post }) => {
  const [showCollectModal, setShowCollectModal] = useState<boolean>(false)
  const isFreeCollect =
    post?.collectModule?.__typename === 'FreeCollectModuleSettings'

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowCollectModal(true)}
    >
      <div className="flex items-center space-x-1 text-red-500 hover:red-brand-400">
        <div className="p-1.5 rounded-full hover:bg-red-300 hover:bg-opacity-20">
          <CollectionIcon className="w-[18px]" />
        </div>
        {post?.stats?.totalAmountOfCollects > 0 && (
          <div className="text-xs">
            {humanize(post?.stats?.totalAmountOfCollects)}
          </div>
        )}
      </div>
      <Modal
        title={
          isFreeCollect
            ? 'Free Collect'
            : getModule(post?.collectModule?.type).name
        }
        icon={
          <div className="text-brand">
            <GetModuleIcon
              module={
                isFreeCollect ? 'FreeCollectModule' : post?.collectModule?.type
              }
              size={5}
            />
          </div>
        }
        show={showCollectModal}
        onClose={() => setShowCollectModal(!showCollectModal)}
      >
        <CollectModule post={post} />
      </Modal>
    </motion.button>
  )
}

export default Collect
