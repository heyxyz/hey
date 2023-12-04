import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createClickhouseClient from '@utils/createClickhouseClient';
import { noBody } from '@utils/responses';

interface QueryResult {
  dname: string;
  last_14_days: string;
  last_7_days: string;
}

interface AccumulatedResults {
  [key: string]: {
    last_14_days: number;
    last_7_days: number;
  };
}

export const get: Handler = async (req, res) => {
  const { handle, id } = req.query;

  if (!id || !handle) {
    return noBody(res);
  }

  try {
    const client = createClickhouseClient();

    // Define each query separately
    const queries: string[] = [
      `
        SELECT 'impressions' AS dname,
          countIf(viewed_at >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(viewed_at >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM impressions
        WHERE splitByString('-', publication_id)[1] = '${id}'
          AND viewed_at < now()
      `,
      `
        SELECT 'profile_views' AS dname,
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Pageview'
          AND JSONExtractString(properties, 'page') = 'profile'
          AND extract(assumeNotNull(url), '/u/([^/?]+)') = '${handle}'
          AND created < now()
      `,
      `
        SELECT 'follows' AS dname,
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Follow profile' AND
          JSONExtractString(properties, 'target') = '${id}' AND
          created < now()
      `,
      `
        SELECT 'likes' AS dname,
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Like publication' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'publication_id')))[1] = '${id}' AND
          created < now()
      `,
      `
        SELECT 'mirrors' AS dname,
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Mirror publication' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'publication_id')))[1] = '${id}' AND
          created < now()
      `,
      `
        SELECT 'comments' AS dname,
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'New comment' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'comment_on')))[1] = '${id}' AND
          created < now()
      `,
      `
        SELECT 'link_clicks' AS dname,
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Click publication oembed' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'publication_id')))[1] = '${id}' AND
          created < now()
      `,
      `
        SELECT 'collects' AS dname,
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Collect publication' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'publication_id')))[1] = '${id}' AND
          created < now()
      `
    ];

    // Execute all queries concurrently
    const results = await Promise.all(
      queries.map((query) =>
        client
          .query({ format: 'JSONEachRow', query })
          .then((rows) => rows.json<QueryResult[]>())
      )
    );

    // Process and combine results
    const combinedResult: AccumulatedResults = results.reduce(
      (acc: any, resultArray) => {
        for (const row of resultArray) {
          acc[row.dname] = {
            last_14_days: Number(row.last_14_days),
            last_7_days: Number(row.last_7_days)
          };
        }
        return acc;
      },
      {}
    );
    logger.info(`Profile stats fetched for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ result: combinedResult, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
