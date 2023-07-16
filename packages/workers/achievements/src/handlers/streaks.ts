import { error } from 'itty-router';

import filteredEvents from '../helpers/filteredNames';
import generateDateRangeDict from '../helpers/generateDateRangeDict';
import type { Env } from '../types';

export default async (id: string, env: Env) => {
  if (!id) {
    return error(400, 'Bad request!');
  }

  try {
    const streaksResponse = await fetch(
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

    if (streaksResponse.status !== 200) {
      return new Response(
        JSON.stringify({ success: false, error: 'Status code is not 200!' })
      );
    }

    const json: {
      data: [string, string][];
    } = await streaksResponse.json();

    // Populate the dates with 0s for the dates that have no events or no date in the DB
    const eventData = json.data.reduce((acc: any, [date, count]) => {
      acc[date] = Number(count);
      return acc;
    }, {});

    const allDatesData = { ...generateDateRangeDict(), ...eventData };

    let response = new Response(
      JSON.stringify({ success: true, data: allDatesData })
    );

    // Cache for 10 minutes
    response.headers.set('Cache-Control', 'max-age=600');

    return response;
  } catch (error) {
    console.error('Failed to get streaks', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
