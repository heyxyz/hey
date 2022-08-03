import { Tooltip } from '@components/UI/Tooltip'
import { LensterPublication } from '@generated/lenstertypes'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import humanize from '@lib/humanize'
import nFormatter from '@lib/nFormatter'
import { motion } from 'framer-motion'
import { FC } from 'react'
import { usePublicationStore } from 'src/store/publication'

interface Props {
  publication: LensterPublication
}

const Comment: FC<Props> = ({ publication }) => {
  const { setParentPub, setShowNewPostModal } = usePublicationStore()
  const count =
    publication.__typename === 'Mirror'
      ? publication?.mirrorOf?.stats?.totalAmountOfComments
      : publication?.stats?.totalAmountOfComments

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        setParentPub(publication)
        setShowNewPostModal(true)
      }}
      aria-label="Like"
      data-test="publication-comment"
    >
      <div className="flex items-center space-x-1 text-blue-500 hover:text-blue-400">
        <div className="p-1.5 rounded-full hover:bg-blue-300 hover:bg-opacity-20">
          <Tooltip
            placement="top"
            content={count > 0 ? `${humanize(count)} Comments` : 'Comment'}
            withDelay
          >
            <ChatAlt2Icon className="w-[18px]" />
          </Tooltip>
        </div>
        {count > 0 && <div className="text-xs">{nFormatter(count)}</div>}
      </div>
    </motion.button>
  )
}

export default Comment
