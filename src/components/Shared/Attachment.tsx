import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import { PhotographIcon } from '@heroicons/react/outline'
import trackEvent from '@lib/trackEvent'
import uploadAssetsToIPFS from '@lib/uploadAssetsToIPFS'
import { motion } from 'framer-motion'
import { ChangeEvent, Dispatch, FC, useId, useState } from 'react'

interface Props {
  attachments: any
  setAttachments: Dispatch<any>
}

const Attachment: FC<Props> = ({ attachments, setAttachments }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const id = useId()

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setLoading(true)

    try {
      const attachment = await uploadAssetsToIPFS(evt.target.files![0])
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
        onClick={() => trackEvent('choose attachment')}
      >
        <label className="flex gap-1 items-center cursor-pointer" htmlFor={id}>
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <Tooltip placement="top" content="Media">
              <PhotographIcon className="w-5 h-5 text-brand" />
            </Tooltip>
          )}
          <input
            id={id}
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
