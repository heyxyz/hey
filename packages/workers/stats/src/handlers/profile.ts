import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;
  const handle = request.query.handle as string;

  if (!id || !handle) {
    return response({ success: false, error: 'No id and handle provided!' });
  }

  try {
    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
    const rows = await client.query({
      query: `
        SELECT
          'impressions' AS name,
          countIf(viewed_at >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(viewed_at >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM impressions
        WHERE
          splitByString('-', publication_id)[1] = '${id}'
          AND viewed_at < now()
        UNION ALL
        SELECT
          'profile_views',
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Pageview'
          AND JSONExtractString(properties, 'page') = 'profile'
          AND extract(assumeNotNull(url), '/u/([^/?]+)') = '${handle}'
          AND created < now()
        UNION ALL
        SELECT 
          'follows',
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Follow profile' AND
          JSONExtractString(properties, 'target') = '${id}' AND
          created < now()
        UNION ALL
        SELECT 
          'likes',
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Like publication' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'publication_id')))[1] = '${id}' AND
          created < now()
        UNION ALL
        SELECT
          'mirrors',
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Mirror publication' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'publication_id')))[1] = '${id}' AND
          created < now()
        UNION ALL
        SELECT 
          'comments',
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'New comment' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'comment_on')))[1] = '${id}' AND
          created < now()
        UNION ALL
        SELECT 
          'link_clicks',
          countIf(created >= now() - INTERVAL 7 DAY) AS last_7_days,
          countIf(created >= now() - INTERVAL 14 DAY) AS last_14_days
        FROM events
        WHERE
          name = 'Click publication oembed' AND
          splitByChar('-', assumeNotNull(JSONExtractString(properties, 'publication_id')))[1] = '${id}' AND
          created < now()
      `,
      format: 'JSONEachRow'
    });

    const result = await rows.json<
      Array<{
        name: string;
        last_7_days: string;
        last_14_days: string;
      }>
    >();

    return response({
      success: true,
      result: result.reduce((acc: any, row) => {
        acc[row.name] = {
          last_7_days: Number(row.last_7_days),
          last_14_days: Number(row.last_14_days)
        };
        return acc;
      }, {})
    });
  } catch (error) {
    throw error;
  }
};
