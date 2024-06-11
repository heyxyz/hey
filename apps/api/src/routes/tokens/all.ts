import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/helpers/constants';

export const get: Handler = async (_, res) => {
  try {
    const data = await goodPg.query(`
      SELECT *
      FROM "AllowedToken"
      ORDER BY priority DESC;
    `);

    logger.info('All tokens fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ success: true, tokens: data });
  } catch (error) {
    return catchedError(res, error);
  }
};
