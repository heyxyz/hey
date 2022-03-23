import { Tooltip } from '@components/UI/Tooltip'
import { GlobeAltIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  setOnlyFollowers: React.Dispatch<React.SetStateAction<any>>
  onlyFollowers: boolean
}

const SelectReferenceModule: React.FC<Props> = ({
  setOnlyFollowers,
  onlyFollowers
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div>
      <Tooltip content="Everyone can reply">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="tab-focus-ring"
          onClick={() => setShowModal(!showModal)}
        >
          <div className="text-brand-500">
            <GlobeAltIcon className="w-5 h-5" />
          </div>
        </motion.button>
      </Tooltip>
    </div>
  )
}

export default SelectReferenceModule
