import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import { noBody } from 'src/lib/responses';

export const get: Handler = async (req, res) => {
  const { id, profile } = req.query;

  if (!id || !profile) {
    return noBody(res);
  }

  try {
    const client = createClickhouseClient();

    const queries: string[] = [
      `
        SELECT
          COUNTIf(toDateTime(created) >= now() - INTERVAL 60 SECOND) AS last_60_seconds,
          COUNTIf(toDate(created) = today()) AS today,
          COUNTIf(toDate(created) = yesterday()) AS yesterday,
          COUNTIf(toDate(created) >= toMonday(now())) AS this_week,
          COUNTIf(toDate(created) >= toStartOfMonth(now())) AS this_month,
          COUNT(*) AS all_time
        FROM events
      `,
      `
        SELECT
          COUNTIf(toDateTime(viewed_at) >= now() - INTERVAL 60 SECOND) AS last_60_seconds,
          COUNTIf(toDate(viewed_at) = today()) AS today,
          COUNTIf(toDate(viewed_at) = yesterday()) AS yesterday,
          COUNTIf(toDate(viewed_at) >= toMonday(now())) AS this_week,
          COUNTIf(toDate(viewed_at) >= toStartOfMonth(now())) AS this_month,
          COUNT(*) AS all_time
        FROM impressions
      `
    ];

    // Execute all queries concurrently
    const results: any = await Promise.all(
      queries.map((query) =>
        client
          .query({ format: 'JSONEachRow', query })
          .then((rows) => rows.json())
      )
    );

    logger.info('Fetched Leafwatch stats');

    return res.status(200).json({
      dau: results[5].map((row: any, index: number) => ({
        date: row.date,
        dau: row.dau,
        events: row.events,
        impressions: results[6][index].impressions
      })),
      events: results[0][0],
      eventsToday: results[3],
      impressions: results[1][0],
      impressionsToday: results[4],
      success: true,
      topEvents: results[2]
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
