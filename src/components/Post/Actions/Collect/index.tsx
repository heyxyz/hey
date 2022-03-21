import { Modal } from '@components/UI/Modal'
import { LensterPost } from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import { getModule } from '@lib/getModule'
import { humanize } from '@lib/humanize'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const CollectModule = dynamic(() => import('./CollectModule'))

interface Props {
  post: LensterPost
}

const Collect: React.FC<Props> = ({ post }) => {
  const [showCollectModal, setShowCollectModal] = useState<boolean>(false)

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowCollectModal(true)}
    >
      <div className="flex items-center space-x-1 text-red-500 hover:red-brand-400">
        <div className="hover:bg-red-300 hover:bg-opacity-20 p-1.5 rounded-full">
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
          post.collectModule.__typename === 'EmptyCollectModuleSettings'
            ? 'Empty Collect'
            : getModule(post.collectModule.type).name
        }
        size="md"
        show={showCollectModal}
        onClose={() => setShowCollectModal(!showCollectModal)}
      >
        <CollectModule post={post} />
      </Modal>
    </motion.button>
  )
}

export default Collect
