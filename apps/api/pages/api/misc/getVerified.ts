import logger from '@hey/lib/logger';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import {
  REDIS_EX_8_HOURS,
  SWR_CACHE_AGE_10_MINS_30_DAYS
} from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
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
    await redis.set('verified', JSON.stringify(ids), 'EX', REDIS_EX_8_HOURS);
    logger.info('Verified profiles fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, result: ids });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
