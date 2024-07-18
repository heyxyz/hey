import type { Handler } from 'express';

import { getRedis, setRedis } from '@hey/db/redisClient';
import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_1_DAY } from 'src/helpers/constants';

export const get: Handler = async (_, res) => {
  try {
    const cacheKey = 'allowed-tokens';
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      logger.info('(cached) All tokens fetched');
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_1_DAY)
        .json({ success: true, tokens: JSON.parse(cachedData) });
    }

    const data = await heyPg.query(`
      SELECT *
      FROM "AllowedToken"
      ORDER BY priority DESC;
    `);

    await setRedis(cacheKey, data);
    logger.info('All tokens fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE_1_DAY)
      .json({ success: true, tokens: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
