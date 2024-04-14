import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';

export const get: Handler = async (_, res) => {
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
      `,
      `
        SELECT name, COUNT(*) AS count
        FROM events
        WHERE toDate(created) = today()
        GROUP BY name
        ORDER BY count DESC
        LIMIT 10
      `,
      `
        SELECT 
          toStartOfInterval(created, INTERVAL 10 MINUTE) AS timestamp,
          COUNT(*) AS count
        FROM events
        WHERE toDate(created) = today()
        GROUP BY timestamp
        ORDER BY timestamp
      `,
      `
        SELECT 
          toStartOfInterval(viewed_at, INTERVAL 10 MINUTE) AS timestamp,
          COUNT(*) AS count
        FROM impressions
        WHERE toDate(viewed_at) = today()
        GROUP BY timestamp
        ORDER BY timestamp
      `,
      `
        SELECT
          CAST(created AS date) AS date,
          COUNT(DISTINCT COALESCE(actor, fingerprint, ip)) AS dau,
          COUNT(*) AS events
        FROM
          events
        WHERE
          created >= DATE_SUB(NOW(), INTERVAL 10 DAY)
          AND created < NOW()
        GROUP BY CAST(created AS date)
        ORDER BY CAST(created AS date) DESC    
      `,
      `
        SELECT
          CAST(viewed_at AS date) AS date,
          COUNT(*) AS impressions
        FROM
          impressions
        WHERE
          viewed_at >= DATE_SUB(NOW(), INTERVAL 10 DAY)
          AND viewed_at < NOW()
        GROUP BY CAST(viewed_at AS date)
        ORDER BY CAST(viewed_at AS date) DESC    
      `,
      `
        SELECT referrer, count(*) AS count
        FROM events
        WHERE toDate(created) = today() AND referrer IS NOT NULL
        GROUP BY referrer
        ORDER BY count DESC
        LIMIT 15
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
      referrers: results[7],
      success: true,
      topEvents: results[2]
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
