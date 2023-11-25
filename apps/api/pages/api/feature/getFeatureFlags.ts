import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const redis = createRedisClient();
    const cache = await redis.get(`features:${id}`);

    if (cache) {
      logger.info('Features fetched from cache');
      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
        .json({ success: true, cached: true, features: JSON.parse(cache) });
    }

    const data = await prisma.profileFeature.findMany({
      where: {
        profileId: id as string,
        enabled: true,
        feature: { enabled: true }
      },
      select: {
        feature: { select: { key: true } }
      }
    });

    const features = data.map((feature: any) => feature.feature?.key);
    await redis.set(`features:${id}`, JSON.stringify(features));
    logger.info('Features fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, features });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
