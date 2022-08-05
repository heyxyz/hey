import { gql, useQuery } from '@apollo/client'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import HelpTooltip from '@components/UI/HelpTooltip'
import { Spinner } from '@components/UI/Spinner'
import GetModuleIcon from '@components/utils/GetModuleIcon'
import { EnabledModule } from '@generated/types'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { FEE_DATA_TYPE, getModule } from '@lib/getModule'
import { Mixpanel } from '@lib/mixpanel'
import clsx from 'clsx'
import { Dispatch, FC, useState } from 'react'

import FeeEntry from './FeeEntry'

export const MODULES_QUERY = gql`
  query EnabledModules {
    enabledModules {
      collectModules {
        moduleName
        contractAddress
      }
    }
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`

interface Props {
  feeData: FEE_DATA_TYPE
  setSelectedModule: Dispatch<EnabledModule>
  selectedModule: EnabledModule
  setShowModal: Dispatch<boolean>
  setFeeData: Dispatch<FEE_DATA_TYPE>
}

const Modules: FC<Props> = ({
  feeData,
  setSelectedModule,
  selectedModule,
  setShowModal,
  setFeeData
}) => {
  const { error, data, loading } = useQuery(MODULES_QUERY)
  const [showFeeEntry, setShowFeeEntry] = useState<boolean>(false)

  const handleSelectModule = (module: EnabledModule) => {
    setSelectedModule(module)
    if (getModule(module?.moduleName).hasParam) {
      setShowFeeEntry(true)
    } else {
      setShowModal(false)
    }
    Mixpanel.track(
      `Select ${module?.moduleName.toLowerCase()} for new publication`
    )
  }

  if (loading)
    return (
      <div className="py-3.5 px-5 space-y-2 font-bold text-center">
        <Spinner size="md" className="mx-auto" />
        <div>Loading your modules</div>
      </div>
    )

  return (
    <div className="py-3.5 px-5 space-y-3">
      <ErrorMessage title="Failed to load modules" error={error} />
      {showFeeEntry ? (
        <FeeEntry
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          enabledModuleCurrencies={data?.enabledModuleCurrencies}
          setShowFeeEntry={setShowFeeEntry}
          setShowModal={setShowModal}
          feeData={feeData}
          setFeeData={setFeeData}
        />
      ) : (
        data?.enabledModules?.collectModules?.map(
          (module: EnabledModule) =>
            getModule(module?.moduleName).name !== 'none' && (
              <div key={module?.contractAddress}>
                <button
                  type="button"
                  className={clsx(
                    {
                      'border-green-500':
                        module?.moduleName === selectedModule.moduleName
                    },
                    'w-full p-3 text-left border dark:border-gray-700/80 rounded-xl flex items-center justify-between'
                  )}
                  onClick={() => handleSelectModule(module)}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="text-brand">
                        <GetModuleIcon module={module.moduleName} size={4} />
                      </div>
                      <div className="space-x-1.5 font-bold">
                        {getModule(module?.moduleName).name}
                      </div>
                      <HelpTooltip
                        content={getModule(module.moduleName).helper}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {module?.contractAddress}
                    </div>
                  </div>
                  {module?.moduleName === selectedModule.moduleName && (
                    <CheckCircleIcon className="w-7 h-7 text-green-500" />
                  )}
                </button>
              </div>
            )
        )
      )}
    </div>
  )
}

export default Modules
