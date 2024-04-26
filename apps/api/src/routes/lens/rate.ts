import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { SWR_CACHE_AGE_10_SECS_30_DAYS } from 'src/helpers/constants';

// TODO: add tests
export const get: Handler = async (req, res) => {
  try {
    const response = await lensPg.query(`
      SELECT ec.name AS name,
        ec.symbol AS symbol,
        ec.decimals AS decimals,
        ec.currency AS address,
        fc.price AS fiat
      FROM fiat.conversion AS fc
      JOIN enabled.currency AS ec ON fc.currency = ec.currency
      WHERE fc.fiatsymbol = 'usd';
    `);

    const result = response.map((row: any) => ({
      address: row.address.toLowerCase(),
      decimals: row.decimals,
      fiat: Number(row.fiat),
      name: row.name,
      symbol: row.symbol
    }));

    logger.info('Lens: Fetched USD conversion rates');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_SECS_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
