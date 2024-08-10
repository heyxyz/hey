import type { Request, Response } from 'express';

import { getRedis, setRedis } from '@hey/db/redisClient';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS, VERIFIED_FEATURE_ID } from 'src/helpers/constants';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import prisma from 'src/helpers/prisma';

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      const cacheKey = 'verified';
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info('(cached) Verified profiles fetched');
        return res
          .status(200)
          .setHeader('Cache-Control', CACHE_AGE_30_MINS)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const data = await prisma.profileFeature.findMany({
        select: { profileId: true },
        where: { enabled: true, featureId: VERIFIED_FEATURE_ID }
      });

      const ids = data.map(({ profileId }) => profileId);
      await setRedis(cacheKey, ids);
      logger.info('Verified profiles fetched');

      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_30_MINS)
        .json({ result: ids, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
