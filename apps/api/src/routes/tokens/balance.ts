import type { Handler } from 'express';

import { createPublicClient, http, parseAbi } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

import catchedError from '../../lib/catchedError';
import { RPC_URL } from '../../lib/constants';
import { noBody } from '../../lib/responses';

export const get: Handler = async (req, res) => {
  const { account, tokenAddress } = req.query;

  if (
    !tokenAddress ||
    typeof tokenAddress !== 'string' ||
    !account ||
    typeof account !== 'string'
  ) {
    return noBody(res);
  }

  const network = req.headers['x-lens-network'] as string;
  const isMainnet = network === 'mainnet';

  try {
    const client = createPublicClient({
      chain: isMainnet ? polygon : polygonMumbai,
      transport: http(RPC_URL)
    });

    const result = await client.readContract({
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      address: tokenAddress as `0x${string}`,
      args: [account as `0x${string}`],
      functionName: 'balanceOf'
    });

    console.log('balance:get result', result);

    return res.status(200).json({ result: result.toString(), success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
