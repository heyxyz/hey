import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterAttachment } from '@generated/lenstertypes'
import { PhotographIcon } from '@heroicons/react/outline'
import trackEvent from '@lib/trackEvent'
import uploadAssetsToIPFS from '@lib/uploadAssetsToIPFS'
import { motion } from 'framer-motion'
import { ChangeEvent, Dispatch, FC, useId, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  attachments: LensterAttachment[]
  setAttachments: Dispatch<LensterAttachment[]>
}

const Attachment: FC<Props> = ({ attachments, setAttachments }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const id = useId()

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setLoading(true)

    try {
      if (evt.target.files!.length > 4) {
        toast.error('Only 4 attachments are allowed!')
      } else {
        const attachment = await uploadAssetsToIPFS(evt.target.files)
        if (attachment) {
          setAttachments(attachment)
        }
      }
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
        aria-label="Choose Attachment"
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
            multiple
            accept="image/*, video/*"
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
