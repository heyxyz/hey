import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import { getRedis, setRedis } from '@hey/db/redisClient';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS, VERIFIED_FEATURE_ID } from 'src/helpers/constants';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';

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

      const data = await heyPg.query(
        `
        SELECT "profileId"
        FROM "ProfileFeature"
        WHERE enabled = TRUE
        AND "featureId" = $1;
      `,
        [VERIFIED_FEATURE_ID]
      );

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
