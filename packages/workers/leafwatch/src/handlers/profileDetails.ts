import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const clickhouseResponse = await fetch(
      `${request.env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `
          WITH events_counts AS (
            SELECT
                actor,
                country,
                region,
                city,
                os,
                browser,
                browser_version,
                COUNT() AS cnt
            FROM events
            WHERE actor = '${id}'
            GROUP BY actor, country, region, city, os, browser, browser_version
        )
        SELECT
            actor,
            argMax(country, cnt) AS most_common_country,
            argMax(region, cnt) AS most_common_region,
            argMax(city, cnt) AS most_common_city,
            SUM(cnt) AS number_of_events,
            argMax(os, cnt) AS most_common_os,
            argMax(browser, cnt) AS most_common_browser,
            argMax(browser_version, cnt) AS most_common_browser_version
        FROM events_counts
        WHERE actor = '${id}'
        GROUP BY actor;
      ;`
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: string[][];
    } = await clickhouseResponse.json();
    const data = json.data[0] || null;

    return response({
      success: true,
      result: data
        ? {
            actor: data?.[0],
            country: data?.[1],
            region: data?.[2],
            city: data?.[3],
            events: parseInt(data?.[4]),
            os: data?.[5],
            browser: data?.[6],
            version: data?.[7]
          }
        : null
    });
  } catch (error) {
    throw error;
  }
};
