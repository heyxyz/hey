import type { Address } from 'viem';

import axios from 'axios';

const getSwapRewardPool = async (
  id: number
): Promise<{ token: Address | null }> => {
  const payload = {
    extensions: {},
    query: `{
        rewardPools(first: 1, where: {rewardsPoolId: ${id}}) {
          token
        }
      }`
  };

  const { data } = await axios.post(
    'https://api.thegraph.com/subgraphs/name/mad-finance/madfi-subgraph',
    payload
  );
  const { data: pool } = data;

  return { token: pool?.rewardPools[0]?.token };
};

export default getSwapRewardPool;
