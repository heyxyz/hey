import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: 'No id provided!' });
  }

  try {
    const clickhouseResponse = await fetch(
      `${request.env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `
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
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string][][];
    } = await clickhouseResponse.json();

    return response({
      success: true,
      totalImpressions: Number(json.data?.[0]?.[2]) || 0,
      yearlyImpressions: json.data.map((item) => ({
        day: item[0],
        impressions: Number(item[1])
      }))
    });
  } catch (error) {
    throw error;
  }
};
