import type { RewardPool } from '@hey/types/misc';
import type { Address } from 'viem';

import axios from 'axios';

const getBestReward = (rewardPools: RewardPool[]): RewardPool => {
  return rewardPools.sort((a, b) => {
    // Compare by percentReward first, descending
    if (a.percentReward !== b.percentReward) {
      return b.percentReward - a.percentReward;
    }

    // Then compare by rewardsRemaining, descending
    const aRemaining = BigInt(a.rewardsRemaining);
    const bRemaining = BigInt(b.rewardsRemaining);
    if (aRemaining !== bRemaining) {
      return aRemaining < bRemaining ? 1 : -1;
    }

    // Lastly, compare by cap, descending
    const aCap = BigInt(a.cap);
    const bCap = BigInt(b.cap);
    if (aCap !== bCap) {
      return aCap < bCap ? 1 : -1;
    }

    return 0;
  })[0];
};

const getSwapRewardPool = async (
  token: Address
): Promise<null | RewardPool> => {
  const payload = {
    extensions: {},
    query: `{
      rewardPools(where: {
        token: "${token}"
      }) {
        rewardsPoolId
        rewardsAmount
        rewardsRemaining
        cap
        percentReward
      }
    }`
  };

  const { data } = await axios.post(
    'https://api.thegraph.com/subgraphs/name/mad-finance/madfi-subgraph',
    payload
  );
  const { data: pool } = data;
  const rewardPool = getBestReward(pool?.rewardPools || []);

  if (!rewardPool) {
    return null;
  }

  return rewardPool;
};

export default getSwapRewardPool;
