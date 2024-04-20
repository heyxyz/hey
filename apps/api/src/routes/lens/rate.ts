import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_SECS_30_DAYS } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';

// TODO: add tests
export const get: Handler = async (req, res) => {
  try {
    const response = await lensPrisma.$queryRaw<any>`
      SELECT ec.name AS name,
        ec.symbol AS symbol,
        ec.decimals AS decimals,
        fc.price AS fiat
      FROM fiat.conversion AS fc
      JOIN enabled.currency AS ec ON fc.currency = ec.currency
      WHERE fc.fiatsymbol = 'usd';
    `;

    const result = response;

    logger.info('Lens: Fetched USD conversion rates');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_SECS_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
