import type { Handler } from 'express';
import type { Address } from 'viem';

import { HeyMembershipNft } from '@hey/abis';
import { HEY_MEMBERSHIP_NFT } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import catchedError from 'src/helpers/catchedError';
import {
  CACHE_AGE_INDEFINITE,
  SWR_CACHE_AGE_10_MINS_30_DAYS
} from 'src/helpers/constants';
import getRpc from 'src/helpers/getRpc';
import { noBody } from 'src/helpers/responses';
import { createPublicClient } from 'viem';
import { polygon } from 'viem/chains';

export const get: Handler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return noBody(res);
  }

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: getRpc({ mainnet: true })
    });

    const heyNft = await client.readContract({
      abi: HeyMembershipNft,
      address: HEY_MEMBERSHIP_NFT,
      args: [address as Address],
      functionName: 'balanceOf'
    });
    const hasHeyNft = Number(heyNft) > 0;

    logger.info(`Hey NFT badge fetched for ${address}`);

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        hasHeyNft ? CACHE_AGE_INDEFINITE : SWR_CACHE_AGE_10_MINS_30_DAYS
      )
      .json({ hasHeyNft, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
