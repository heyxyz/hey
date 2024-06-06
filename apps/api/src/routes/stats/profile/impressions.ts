import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { noBody } from 'src/helpers/responses';

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
        WITH
          date_series AS (
            SELECT toDate(subtractDays(now(), number)) AS date
            FROM numbers(30)
          ),
          impressions_extracted AS (
            SELECT
              toDate(viewed_at) AS date,
              splitByChar('-', publication_id)[1] AS viewer_id
            FROM impressions
            WHERE
              splitByChar('-', publication_id)[1] = '${id}'
              AND viewed_at >= now() - INTERVAL 30 DAY
          )
        SELECT
          ds.date,
          count(ie.viewer_id) AS count
        FROM date_series ds
        LEFT JOIN
          impressions_extracted ie
          ON ds.date = ie.date
        GROUP BY ds.date
        ORDER BY ds.date
      `
    });
    const result = await rows.json<{
      count: number;
      date: string;
    }>();
    const impressions = result.map((row) => ({
      count: Number(row.count),
      date: new Date(row.date).toISOString()
    }));

    logger.info('Fetched profile impression stats');

    return res.status(200).json({ impressions });
  } catch (error) {
    return catchedError(res, error);
  }
};
