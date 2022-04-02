import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import { PhotographIcon } from '@heroicons/react/outline'
import { uploadAssetsToIPFS } from '@lib/uploadAssetsToIPFS'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  attachments: any
  setAttachments: React.Dispatch<any>
}

const Attachment: React.FC<Props> = ({ attachments, setAttachments }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleAttachment = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setLoading(true)

    try {
      // @ts-ignore
      const attachment = await uploadAssetsToIPFS(evt.target.files[0])
      setAttachments([...attachments, attachment])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        className="umami--click--attachment-select"
      >
        <label className="flex gap-1 items-center cursor-pointer">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <Tooltip content="Media">
              <PhotographIcon className="w-5 h-5 text-brand-500" />
            </Tooltip>
          )}
          <input
            type="file"
            accept="image/*, video/mp4"
            className="hidden"
            onChange={handleAttachment}
            disabled={attachments.length >= 4}
          />
        </label>
      </motion.button>
    </div>
  )
}

export default Attachment
