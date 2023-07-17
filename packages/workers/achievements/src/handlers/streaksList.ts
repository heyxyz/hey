import { error } from 'itty-router';

import filteredEvents from '../helpers/filteredNames';
import type { Env } from '../types';

export default async (id: string, date: string, env: Env) => {
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
            name,
            created
          FROM events
          WHERE actor = '${id}' AND created >= now() - INTERVAL 1 YEAR
          AND name IN (${filteredEvents.map((name) => `'${name}'`).join(',')})
          AND DATE(created) = '${date}';
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

    let response = new Response(
      JSON.stringify({
        success: true,
        data: json.data.map(([event, date]) => ({ event, date }))
      })
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
