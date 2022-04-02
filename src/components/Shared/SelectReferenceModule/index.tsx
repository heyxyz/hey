import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { ChatAlt2Icon, GlobeAltIcon, UsersIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { trackEvent } from '@lib/trackEvent'
import clsx from 'clsx'
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
      <Tooltip
        content={
          onlyFollowers ? 'Only followers can comment' : 'Everyone can comment'
        }
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            trackEvent('choose reference module')
            setShowModal(!showModal)
          }}
        >
          <div className="text-brand-500">
            {onlyFollowers ? (
              <UsersIcon className="w-5 h-5" />
            ) : (
              <GlobeAltIcon className="w-5 h-5" />
            )}
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title="Select who to comment"
        icon={<ChatAlt2Icon className="w-5 h-5 text-brand-500" />}
        show={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <div className="dark:divide-gray-700">
          <div className="py-3.5 px-5 space-y-3">
            <button
              type="button"
              className={clsx(
                { 'border-green-500': !onlyFollowers },
                'w-full p-3 space-y-1 text-left border rounded-xl flex justify-between items-center'
              )}
              onClick={() => {
                trackEvent('everyone reference module', 'select')
                setOnlyFollowers(false)
                setShowModal(false)
              }}
            >
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-brand-500" />
                <div>Everyone can comment</div>
              </div>
              {!onlyFollowers && (
                <CheckCircleIcon className="w-7 h-7 text-green-500" />
              )}
            </button>
            <button
              type="button"
              className={clsx(
                { 'border-green-500': onlyFollowers },
                'w-full p-3 space-y-1 text-left border rounded-xl flex justify-between items-center'
              )}
              onClick={() => {
                trackEvent('only followers reference module', 'select')
                setOnlyFollowers(true)
                setShowModal(false)
              }}
            >
              <div className="flex items-center space-x-3">
                <UsersIcon className="w-5 h-5 text-brand-500" />
                <div>Only followers can comment</div>
              </div>
              {onlyFollowers && (
                <CheckCircleIcon className="w-7 h-7 text-green-500" />
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SelectReferenceModule
