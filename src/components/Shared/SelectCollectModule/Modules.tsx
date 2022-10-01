import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import HelpTooltip from '@components/UI/HelpTooltip';
import { Spinner } from '@components/UI/Spinner';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { EnabledModule, EnabledModulesDocument } from '@generated/types';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { getModule } from '@lib/getModule';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import { Dispatch, FC, useState } from 'react';
import { useCollectModuleStore } from 'src/store/collectmodule';

import FeeEntry from './FeeEntry';
interface Props {
  setShowModal: Dispatch<boolean>;
}

const Modules: FC<Props> = ({ setShowModal }) => {
  const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
  const setSelectedCollectModule = useCollectModuleStore((state) => state.setSelectedCollectModule);
  const [showFeeEntry, setShowFeeEntry] = useState(false);

  const { error, data, loading } = useQuery(EnabledModulesDocument);

  const handleSelectModule = (module: EnabledModule) => {
    setSelectedCollectModule(module);
    if (getModule(module?.moduleName).hasParam) {
      setShowFeeEntry(true);
    } else {
      setShowModal(false);
    }
    Mixpanel.track(`Select ${module?.moduleName.toLowerCase()} for new publication`);
  };

  if (loading) {
    return (
      <div className="py-3.5 px-5 space-y-2 font-bold text-center">
        <Spinner size="md" className="mx-auto" />
        <div>Loading your modules</div>
      </div>
    );
  }

  return (
    <div className="py-3.5 px-5 space-y-3">
      <ErrorMessage title="Failed to load modules" error={error} />
      {showFeeEntry ? (
        <FeeEntry
          enabledModuleCurrencies={data?.enabledModuleCurrencies}
          setShowFeeEntry={setShowFeeEntry}
          setShowModal={setShowModal}
        />
      ) : (
        data?.enabledModules?.collectModules?.map(
          (module: any) =>
            getModule(module?.moduleName).name !== 'none' && (
              <div key={module?.contractAddress}>
                <button
                  type="button"
                  className={clsx(
                    {
                      'border-green-500': module?.moduleName === selectedCollectModule.moduleName
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
                      <div className="space-x-1.5 font-bold">{getModule(module?.moduleName).name}</div>
                      <HelpTooltip content={getModule(module.moduleName).helper} />
                    </div>
                    <div className="text-xs text-gray-500">{module?.contractAddress}</div>
                  </div>
                  {module?.moduleName === selectedCollectModule.moduleName && (
                    <CheckCircleIcon className="w-7 h-7 text-green-500" />
                  )}
                </button>
              </div>
            )
        )
      )}
    </div>
  );
};

export default Modules;
