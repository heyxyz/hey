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
    const isTba = bytecode?.length === 348;

    logger.info(`TBA status fetched for ${address}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ isTba, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
