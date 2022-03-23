import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { EnabledModule } from '@generated/types'
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
          className="tab-focus-ring"
          onClick={() => setShowModal(!showModal)}
        >
          <div className="text-brand-500">
            <GetModuleIcon module={selectedModule.moduleName} size={5} />
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        onClose={() => setShowModal(!showModal)}
        title="Select module"
        show={showModal}
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
