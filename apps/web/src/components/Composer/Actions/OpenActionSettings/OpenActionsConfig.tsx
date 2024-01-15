import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { OpenAction } from '@hey/data/enums';
import { Card } from '@hey/ui';
import { type FC } from 'react';

import TipConfig from './Config/Tip';

interface OpenActionsConfigProps {
  name: OpenAction;
  onBack: () => void;
}

const OpenActionsConfig: FC<OpenActionsConfigProps> = ({ name, onBack }) => {
  return (
    <div>
      <button className="flex items-center space-x-2" onClick={onBack}>
        <ArrowLeftIcon className="size-4" />
        <div>
          Back to <b>Open actions</b>
        </div>
      </button>
      <Card className="mt-5 p-5" forceRounded>
        {name === OpenAction.Tip && <TipConfig name={name} />}
      </Card>
    </div>
  );
};

export default OpenActionsConfig;
