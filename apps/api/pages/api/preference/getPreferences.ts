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
    const cache = await redis.get(`preferences:${id}`);

    if (cache) {
      logger.info('Profile preferences fetched from cache');
      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const [preference, pro] = await prisma.$transaction([
      prisma.preference.findUnique({ where: { id: id as string } }),
      prisma.pro.findFirst({ where: { profileId: id as string } })
    ]);

    const response = {
      preference,
      pro: { enabled: Boolean(pro) }
    };

    await redis.set(`preferences:${id}`, JSON.stringify(response));
    logger.info('Profile preferences fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        result: response
      });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
