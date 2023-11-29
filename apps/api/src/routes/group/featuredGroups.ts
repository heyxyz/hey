import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (_req, res) => {
  try {
    const redis = createRedisClient();
    const cache = await redis.get('featured-groups');

    if (cache) {
      logger.info('Featured groups fetched from cache');
      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const data = await prisma.group.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' }
    });
    await redis.set('featured-groups', JSON.stringify(data));
    logger.info('Featured groups fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, result: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
