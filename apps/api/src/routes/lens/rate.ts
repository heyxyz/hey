import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS } from 'src/helpers/constants';
import { getRedis, setRedis } from 'src/helpers/redisClient';

// TODO: add tests
export const get: Handler = async (_, res) => {
  try {
    const cacheKey = 'rates';
    const cachedRates = await getRedis(cacheKey);

    if (cachedRates) {
      logger.info('(cached) [Lens] Fetched USD conversion rates');
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_30_MINS)
        .json({ result: JSON.parse(cachedRates), success: true });
    }

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

    await setRedis(cacheKey, result);
    logger.info('[Lens] Fetched USD conversion rates');

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_30_MINS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
