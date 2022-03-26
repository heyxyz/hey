import { Modal } from '@components/UI/Modal'
import GetModuleIcon from '@components/utils/GetModuleIcon'
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
          <div className="flex items-center space-x-2">
            <div className="text-brand-500">
              <GetModuleIcon
                module={
                  post.collectModule.__typename === 'EmptyCollectModuleSettings'
                    ? 'EmptyCollectModule'
                    : post.collectModule.type
                }
                size={5}
              />
            </div>
            <div>
              {post.collectModule.__typename === 'EmptyCollectModuleSettings'
                ? 'Empty Collect'
                : getModule(post.collectModule.type).name}
            </div>
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
