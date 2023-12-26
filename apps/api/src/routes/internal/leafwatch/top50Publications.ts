import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';

export const get: Handler = async (req, res) => {
  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        SELECT 
          publication_id AS id,
          COUNT(*) AS count
        FROM impressions
        WHERE viewed_at > now() - INTERVAL 24 HOUR
        GROUP BY id
        ORDER BY count DESC
        LIMIT 50
      `
    });

    const result = await rows.json<Array<{ count: number; id: string }>>();
    logger.info(`Fetched top 50 publications fetched`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
