import type { Handler } from 'express';
import type { Address } from 'viem';

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

    const bytecode = await client.getBytecode({
      address: address as Address
    });

    const deployed = bytecode?.length === 348;
    logger.info(`TBA status fetched: ${address}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ deployed, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
