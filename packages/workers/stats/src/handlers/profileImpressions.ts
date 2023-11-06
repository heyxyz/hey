import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: 'No id provided!' });
  }

  try {
    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
    const rows = await client.query({
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
      `,
      format: 'JSONEachRow'
    });

    const result = await rows.json<
      Array<{
        day: number;
        impressions: number;
        totalImpressions: number;
      }>
    >();

    return response({
      success: true,
      totalImpressions: result[0].totalImpressions,
      yearlyImpressions: result.map((row) => ({
        day: row.day,
        impressions: row.impressions
      }))
    });
  } catch (error) {
    throw error;
  }
};
