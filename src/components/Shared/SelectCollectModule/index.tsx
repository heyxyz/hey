import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { EnabledModule } from '@generated/types'
import { FEE_DATA_TYPE, getModule } from '@lib/getModule'
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
    <div className="px-2">
      <Button
        type="button"
        className="text-xs"
        size="sm"
        outline
        icon={
          <div className="text-brand-500">
            <GetModuleIcon module={selectedModule.moduleName} size={4} />
          </div>
        }
        onClick={() => setShowModal(!showModal)}
      >
        {getModule(selectedModule.moduleName).name}
      </Button>
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
