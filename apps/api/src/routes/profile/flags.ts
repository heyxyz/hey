import type { ProfileFlags } from '@hey/types/hey';
import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import {
  SUSPENDED_FEATURE_ID,
  SWR_CACHE_AGE_10_MINS_30_DAYS
} from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const profileFeature = await heyPg.query(
      `
        SELECT * FROM "ProfileFeature"
        WHERE enabled = TRUE
        AND "featureId" = $1
        AND "profileId" = $2;
      `,
      [SUSPENDED_FEATURE_ID, id as string]
    );

    const response: ProfileFlags = {
      isSuspended: profileFeature[0]?.featureId === SUSPENDED_FEATURE_ID
    };

    logger.info('Profile flags fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: response, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
