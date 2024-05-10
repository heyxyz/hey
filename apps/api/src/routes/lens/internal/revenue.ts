import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/helpers/constants';

// TODO: add tests
export const get: Handler = async (req, res) => {
  try {
    const result = await lensPg.query(`
      SELECT
        DATE_TRUNC('month', r.block_timestamp) AS month,
        c.name AS currency,
        c.symbol AS symbol,
        SUM(r.amount / POWER(10, c.decimals)) AS revenue
      FROM app.profile_revenue_record r
      JOIN enabled.currency c ON r.currency = c.currency
      WHERE r.app = 'hey' 
        AND r.fiat_price_snapshot IS NOT NULL
        AND DATE_TRUNC('month', r.block_timestamp) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', r.block_timestamp), c.name, c.symbol
      ORDER BY month, revenue DESC;
    `);

    logger.info('Lens: Fetched app revenue');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
