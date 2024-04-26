import type { RewardPool } from '@hey/types/misc';
import type { FC } from 'react';

import { GiftIcon } from '@heroicons/react/24/outline';
import getSwapRewardPool from '@hey/helpers/getSwapRewardPool';
import humanize from '@hey/helpers/humanize';
import { useEffect, useRef, useState } from 'react';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';
import { type Address, formatUnits, isAddress } from 'viem';

import { useSwapActionStore } from '.';
import RewardConfig from './RewardConfig';

const PoolConfig: FC = () => {
  const [rewardsPool, setRewardsPool] = useState<null | RewardPool>(null);
  const { decimals, rewardsPoolId, setRewardsPoolId, symbol, token } =
    useSwapActionStore();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  useEffect(() => {
    if (isAddress(token as Address)) {
      getSwapRewardPool(token as Address).then((pool) => {
        if (pool) {
          setRewardsPool(pool);
          setRewardsPoolId(parseInt(pool.rewardsPoolId));
        } else {
          setRewardsPool(null);
          setRewardsPoolId(null);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!rewardsPool?.rewardsPoolId) {
    return null;
  }

  const percent = rewardsPool.percentReward / 100;
  const remaining = humanize(
    parseFloat(formatUnits(BigInt(rewardsPool.rewardsRemaining), decimals))
  );
  const cap = humanize(
    parseFloat(formatUnits(BigInt(rewardsPool.cap), decimals))
  );

  return (
    <div className="mt-5">
      <div className="flex items-start space-x-3">
        <GiftIcon className="mt-1 size-5" />
        <div>
          <b>Reward pool found for ${symbol}</b>
          <div className="ld-text-gray-500 max-w-md text-sm">
            You will receive <b>{percent}%</b> of every swap from the rewards
            pool.{' '}
            <b>
              {remaining} ${symbol}
            </b>{' '}
            rewards remaining, (max{' '}
            <b>
              {cap} ${symbol}
            </b>{' '}
            per swap)
          </div>
        </div>
      </div>
      {rewardsPoolId !== null ? <RewardConfig /> : null}
    </div>
  );
};

export default PoolConfig;
