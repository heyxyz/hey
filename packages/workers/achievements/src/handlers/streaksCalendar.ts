import { Errors } from '@lenster/data/errors';
import response from '@lenster/lib/response';

import filteredEvents from '../helpers/filteredNames';
import generateDateRangeDict from '../helpers/generateDateRangeDict';
import type { Env } from '../types';

export default async (id: string, env: Env) => {
  if (!id) {
    return response({ success: false, error: Errors.NoBody });
  }

  try {
    const clickhouseResponse = await fetch(
      `${env.CLICKHOUSE_REST_ENDPOINT}&default_format=JSONCompact`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cf: { cacheTtl: 600, cacheEverything: true },
        body: `
          SELECT
            date(created) AS event_date,
            count(*) AS event_count
          FROM events
          WHERE actor = '${id}' AND created >= now() - INTERVAL 1 YEAR
          AND name IN (${filteredEvents.map((name) => `'${name}'`).join(',')})
          GROUP BY event_date
          ORDER BY event_date;
        `
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    const json: {
      data: [string, string][];
    } = await clickhouseResponse.json();

    // Populate the dates with 0s for the dates that have no events or no date in the DB
    const eventData = json.data.reduce((acc: any, [date, count]) => {
      acc[date] = Number(count);
      return acc;
    }, {});

    const allDatesData = { ...generateDateRangeDict(), ...eventData };

    return response({ success: true, data: allDatesData });
  } catch (error) {
    throw error;
  }
};
