import { Tooltip } from '@components/UI/Tooltip'
import { EyeIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import { Dispatch, FC } from 'react'

interface Props {
  preview: boolean
  setPreview: Dispatch<boolean>
}

const Preview: FC<Props> = ({ preview, setPreview }) => {
  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => {
          setPreview(!preview)
        }}
        aria-label="Choose Attachment"
      >
        <Tooltip placement="top" content="Preview">
          <EyeIcon className="w-5 h-5 text-brand" />
        </Tooltip>
      </motion.button>
    </div>
  )
}

export default Preview
