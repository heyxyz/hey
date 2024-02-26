import type { Handler } from 'express';
import type { Address } from 'viem';

import { IS_MAINNET } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { RPC_URL, SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/lib/constants';
import { noBody } from 'src/lib/responses';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

export const get: Handler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return noBody(res);
  }

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: http(RPC_URL)
    });

    const hasHeyNft = await client.readContract({
      abi: [
        {
          inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function'
        }
      ],
      address: IS_MAINNET
        ? '0x100372BBF7f975f6b1448fB11AB0F814b2740EEd'
        : '0x75120677aBF34ae95a916C6E9DbB610a06536CC3',
      args: [address as Address],
      functionName: 'balanceOf'
    });

    logger.info(`Hey NFT badge fetched for ${address}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ hasHeyNft: Number(hasHeyNft) > 0, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
