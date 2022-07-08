import Loader from '@components/Shared/Loader'
import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { LensterPost } from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import { getModule } from '@lib/getModule'
import humanize from '@lib/humanize'
import nFormatter from '@lib/nFormatter'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'

const CollectModule = dynamic(() => import('./CollectModule'), {
  loading: () => <Loader message="Loading collect" />
})

interface Props {
  post: LensterPost
}

const Collect: FC<Props> = ({ post }) => {
  const [count, setCount] = useState<number>(0)
  const [showCollectModal, setShowCollectModal] = useState<boolean>(false)
  const isFreeCollect =
    post?.collectModule?.__typename === 'FreeCollectModuleSettings'

  useEffect(() => {
    if (
      post?.mirrorOf?.stats?.totalAmountOfCollects ||
      post?.stats?.totalAmountOfCollects
    ) {
      setCount(
        post.__typename === 'Mirror'
          ? post?.mirrorOf?.stats?.totalAmountOfCollects
          : post?.stats?.totalAmountOfCollects
      )
    }
  }, [post])

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCollectModal(true)}
        aria-label="Collect"
        data-test="publication-collect"
      >
        <div className="flex items-center space-x-1 text-red-500 hover:red-brand-400">
          <div className="p-1.5 rounded-full hover:bg-red-300 hover:bg-opacity-20">
            <Tooltip
              placement="top"
              content={count > 0 ? `${humanize(count)} Collects` : 'Collect'}
              withDelay
            >
              <CollectionIcon className="w-[18px]" />
            </Tooltip>
          </div>
          {count > 0 && <div className="text-xs">{nFormatter(count)}</div>}
        </div>
      </motion.button>
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
        onClose={() => setShowCollectModal(false)}
      >
        <CollectModule post={post} count={count} setCount={setCount} />
      </Modal>
    </>
  )
}

export default Collect
