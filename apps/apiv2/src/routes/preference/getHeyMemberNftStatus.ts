import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import {
  REDIS_EX_8_HOURS,
  SWR_CACHE_AGE_1_MIN_30_DAYS
} from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const redis = createRedisClient();
    const cache = await redis.get(`membership-nft:${id}`);

    if (cache) {
      logger.info('Membership NFT status fetched from cache');
      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const data = await prisma.membershipNft.findUnique({
      where: { id: id as string }
    });
    await redis.set(
      `membership-nft:${id}`,
      JSON.stringify(data),
      'EX',
      REDIS_EX_8_HOURS
    );
    logger.info('Membership NFT status fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        result: data
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
