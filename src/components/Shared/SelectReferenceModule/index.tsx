import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { ChatAlt2Icon, GlobeAltIcon, UsersIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import trackEvent from '@lib/trackEvent'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Dispatch, FC, useState } from 'react'

interface Props {
  setOnlyFollowers: Dispatch<any>
  onlyFollowers: boolean
}

const SelectReferenceModule: FC<Props> = ({
  setOnlyFollowers,
  onlyFollowers
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const ONLY_FOLLOWERS = 'Only followers can comment or mirror'
  const EVERYONE = 'Everyone can comment or mirror'

  return (
    <>
      <Tooltip
        placement="top"
        content={onlyFollowers ? ONLY_FOLLOWERS : EVERYONE}
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
        title="Select who to comment or mirror"
        icon={<ChatAlt2Icon className="w-5 h-5 text-brand-500" />}
        show={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <div className="py-3.5 px-5 space-y-3">
          <button
            type="button"
            className={clsx(
              { 'border-green-500': !onlyFollowers },
              'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center'
            )}
            onClick={() => {
              trackEvent('everyone reference module', 'select')
              setOnlyFollowers(false)
              setShowModal(false)
            }}
          >
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-5 h-5 text-brand-500" />
              <div>{EVERYONE}</div>
            </div>
            {!onlyFollowers && (
              <CheckCircleIcon className="text-green-500 w-7" />
            )}
          </button>
          <button
            type="button"
            className={clsx(
              { 'border-green-500': onlyFollowers },
              'w-full p-3 border rounded-xl dark:border-gray-700/80 flex justify-between items-center'
            )}
            onClick={() => {
              trackEvent('only followers reference module', 'select')
              setOnlyFollowers(true)
              setShowModal(false)
            }}
          >
            <div className="flex items-center space-x-3">
              <UsersIcon className="w-5 h-5 text-brand-500" />
              <div>{ONLY_FOLLOWERS}</div>
            </div>
            {onlyFollowers && (
              <CheckCircleIcon className="text-green-500 w-7 h-7" />
            )}
          </button>
        </div>
      </Modal>
    </>
  )
}

export default SelectReferenceModule
