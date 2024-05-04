import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import {
  SWR_CACHE_AGE_10_MINS_30_DAYS,
  VERIFIED_FEATURE_ID
} from 'src/helpers/constants';

export const get: Handler = async (_, res) => {
  try {
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
    logger.info('Verified profiles fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: ids, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
