import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { OpenAction } from '@hey/data/enums';
import { type FC } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

import TipConfig from './Config/Tip';

interface OpenActionsConfigProps {
  onBack: () => void;
}

const OpenActionsConfig: FC<OpenActionsConfigProps> = ({ onBack }) => {
  const selectedOpenAction = useOpenActionStore(
    (state) => state.selectedOpenAction
  );

  return (
    <div>
      <button className="flex items-center space-x-2" onClick={onBack}>
        <ArrowLeftIcon className="size-4" />
        <div>
          Back to <b>Open actions</b>
        </div>
      </button>
      <div className="mt-5">
        {selectedOpenAction === OpenAction.Tip && <TipConfig />}
      </div>
    </div>
  );
};

export default OpenActionsConfig;
