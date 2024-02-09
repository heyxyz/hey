import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from 'src/lib/constants';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `
        WITH toYear(now()) AS current_year
        SELECT
          day,
          impressions,
          totalImpressions
        FROM (
          SELECT
            toDayOfYear(viewed_at) AS day,
            count() AS impressions
          FROM impressions
          WHERE splitByString('-', publication_id)[1] = '${id}'
            AND toYear(viewed_at) = current_year
          GROUP BY day
        ) AS dailyImpressions
        CROSS JOIN (
          SELECT count() AS totalImpressions
          FROM impressions
          WHERE splitByString('-', publication_id)[1] = '${id}'
            AND toYear(viewed_at) = current_year
        ) AS total
        ORDER BY day
      `
    });

    const result =
      await rows.json<
        Array<{ day: number; impressions: number; totalImpressions: number }>
      >();
    logger.info(`Profile impressions fetched for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .json({
        success: true,
        totalImpressions: Number(result[0]?.totalImpressions),
        yearlyImpressions: result.map((row) => ({
          day: row.day,
          impressions: Number(row.impressions)
        }))
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
