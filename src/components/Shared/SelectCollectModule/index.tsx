import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { EnabledModule } from '@generated/types'
import { CashIcon } from '@heroicons/react/outline'
import { FEE_DATA_TYPE, getModule } from '@lib/getModule'
import { motion } from 'framer-motion'
import { useState } from 'react'

import Modules from './Modules'

interface Props {
  feeData: FEE_DATA_TYPE
  setFeeData: React.Dispatch<React.SetStateAction<FEE_DATA_TYPE>>
  setSelectedModule: React.Dispatch<React.SetStateAction<any>>
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
    <div>
      <Tooltip content={getModule(selectedModule.moduleName).name}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="umami--click--collect-module-select"
          onClick={() => setShowModal(!showModal)}
        >
          <div className="text-brand-500">
            <GetModuleIcon module={selectedModule.moduleName} size={5} />
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title="Select collect module"
        icon={<CashIcon className="h-5 w-5 text-brand-500" />}
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
    </div>
  )
}

export default SelectCollectModule
