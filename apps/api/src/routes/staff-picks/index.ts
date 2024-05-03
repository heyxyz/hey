import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import {
  STAFF_PICK_FEATURE_ID,
  SWR_CACHE_AGE_10_SECS_30_DAYS
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
      [STAFF_PICK_FEATURE_ID]
    );

    const random = data.sort(() => Math.random() - Math.random());
    const picks = random.slice(0, 150);

    logger.info('Staff picks fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_SECS_30_DAYS)
      .json({ result: picks, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
