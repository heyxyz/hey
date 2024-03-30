import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { Input } from '@hey/ui';

import { useSwapActionStore } from '.';

const RewardConfig: FC = () => {
  const { setSharedRewardPercent, sharedRewardPercent } = useSwapActionStore();

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Add a fee on top of the swaps."
        heading="Charge a fee"
        icon={<ReceiptPercentIcon className="size-5" />}
        on={sharedRewardPercent > 0}
        setOn={() => setSharedRewardPercent(sharedRewardPercent ? 0 : 5)}
      />
      {sharedRewardPercent > 0 ? (
        <div className="ml-8 mt-4 flex space-x-2 text-sm">
          <Input
            iconRight="%"
            label="Reward percent"
            max="100"
            min="1"
            onChange={(event) => {
              setSharedRewardPercent(
                parseInt(event.target.value ? event.target.value : '0')
              );
            }}
            placeholder="5"
            type="number"
            value={sharedRewardPercent}
          />
        </div>
      ) : null}
    </div>
  );
};

export default RewardConfig;
