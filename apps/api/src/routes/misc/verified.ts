import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_30_MINS, VERIFIED_FEATURE_ID } from 'src/helpers/constants';
import { getRedis, setRedis } from 'src/helpers/redisClient';

export const get: Handler = async (_, res) => {
  try {
    const cacheKey = 'verified';
    const verifiedIds = await getRedis(cacheKey);

    if (verifiedIds) {
      logger.info('(cached) Verified profiles fetched');
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_30_MINS)
        .json({ result: JSON.parse(verifiedIds), success: true });
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
};
