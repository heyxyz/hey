import createClickhouseClient from '@hey/clickhouse/createClickhouseClient';
import { Errors } from '@hey/data/errors';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../../../leafwatch/src/types';

export default async (request: WorkerRequest) => {
  const id = request.query.id as string;

  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const client = createClickhouseClient(request.env.CLICKHOUSE_PASSWORD);
    const rows = await client.query({
      query: `
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
      `,
      format: 'JSONEachRow'
    });

    const result = await rows.json<
      Array<{
        actor: string;
        most_common_country: string;
        most_common_region: string;
        most_common_city: string;
        number_of_events: string;
        most_common_os: string;
        most_common_browser: string;
        most_common_browser_version: string;
      }>
    >();

    return response({
      success: true,
      result: result[0]
        ? {
            actor: result[0].actor,
            country: result[0].most_common_country,
            region: result[0].most_common_region,
            city: result[0].most_common_city,
            events: parseInt(result[0].number_of_events),
            os: result[0].most_common_os,
            browser: result[0].most_common_browser,
            version: result[0].most_common_browser_version
          }
        : null
    });
  } catch (error) {
    throw error;
  }
};
