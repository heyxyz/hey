import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (_req, res) => {
  try {
    const redis = createRedisClient();
    const cache = await redis.get('verified');

    if (cache) {
      logger.info('Verified profiles fetched from cache');
      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const data = await prisma.verified.findMany({
      select: { id: true }
    });

    const ids = data.map((item: any) => item.id);
    await redis.set('verified', JSON.stringify(ids));
    logger.info('Verified profiles fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, result: ids });
  } catch (error) {
    return catchedError(res, error);
  }
};
