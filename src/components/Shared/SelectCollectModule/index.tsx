import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { EnabledModule } from '@generated/types'
import { CashIcon } from '@heroicons/react/outline'
import { FEE_DATA_TYPE, getModule } from '@lib/getModule'
import trackEvent from '@lib/trackEvent'
import { motion } from 'framer-motion'
import { Dispatch, useState } from 'react'

import Modules from './Modules'

interface Props {
  feeData: FEE_DATA_TYPE
  setFeeData: Dispatch<React.SetStateAction<FEE_DATA_TYPE>>
  setSelectedModule: Dispatch<React.SetStateAction<any>>
  selectedModule: EnabledModule
}

const SelectCollectModule: React.FC<Props> = ({
  feeData,
  setFeeData,
  setSelectedModule,
  selectedModule
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <Tooltip content={getModule(selectedModule.moduleName).name}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            trackEvent('choose collect module')
            setShowModal(!showModal)
          }}
        >
          <div className="text-brand-500">
            <GetModuleIcon module={selectedModule.moduleName} size={5} />
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title="Select collect module"
        icon={<CashIcon className="w-5 h-5 text-brand-500" />}
        show={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <Modules
          feeData={feeData}
          setFeeData={setFeeData}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          setShowModal={setShowModal}
        />
      </Modal>
    </>
  )
}

export default SelectCollectModule
