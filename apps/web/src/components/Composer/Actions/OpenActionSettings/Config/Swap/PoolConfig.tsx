import type { FC } from 'react';
import type { Address } from 'viem';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { GiftIcon } from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import getSwapRewardPool from '@hey/lib/getSwapRewardPool';
import { Input } from '@hey/ui';
import { useEffect, useRef, useState } from 'react';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';

import { useSwapActionStore } from '.';

const PoolConfig: FC = () => {
  const [rewardsPool, setRewardsPool] = useState<any>();
  const { rewardsPoolId, setRewardsPoolId, setToken } = useSwapActionStore();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  useEffect(() => {
    if (rewardsPoolId !== null) {
      getSwapRewardPool(rewardsPoolId).then((pool) => {
        setRewardsPool(pool);
        setToken(pool.token || null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardsPoolId]);

  return (
    <div>
      <ToggleWithHelper
        description="Tap into an incentive pool"
        heading="Use a rewards pool"
        icon={<GiftIcon className="size-5" />}
        on={rewardsPoolId !== null}
        setOn={() => {
          setToken(
            rewardsPoolId === null ? null : (DEFAULT_COLLECT_TOKEN as Address)
          );
          setRewardsPoolId(rewardsPoolId === null ? 1 : null);
        }}
      />
      {rewardsPoolId !== null ? (
        <div className="ml-8 mt-4 text-sm">
          <Input
            className="no-spinner"
            label="Pool ID"
            min="1"
            onChange={(event) => {
              setRewardsPoolId(event.target.value as unknown as number);
            }}
            placeholder="5"
            ref={inputRef}
            type="number"
            value={rewardsPoolId}
          />
          {!rewardsPool.token ? (
            <div className="mt-1 font-bold text-red-500">
              No Pools Available
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PoolConfig;
